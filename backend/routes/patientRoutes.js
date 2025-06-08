const express = require("express");
const { encrypt, decrypt } = require("../utils/cryptoUtils.js");
const pool = require("../db.js");
const { v1: uuidv1 } = require("uuid"); // Import UUID v1
const fs = require('fs');
const path = require('path');

const { upload } = require('../utils/multer.js')

const router = express.Router();

// Agregar pacientes
router.post("/add", async (req, res) => {
  const { idnumber, idtype, name, lastname, birthdate, gender, phone, email, age } = req.body;

  if (!idnumber || !idtype || !name || !lastname || !birthdate || !gender) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Generate UUID for person
    const personUuid = uuidv1();

    // Insert into `person`
    const [personResult] = await connection.query(
      `INSERT INTO person (gender, birthdate, creator, date_created, uuid) VALUES (?, ?, ?, NOW(), ?)`,
      [gender, birthdate, 3, personUuid] // Assuming creator ID is 3
    );

    const personId = personResult.insertId;

    // Insert into `patient`
    await connection.query(
      `INSERT INTO patient (patient_id, creator, date_created) VALUES (?, ?, NOW())`,
      [personId, 3]
    );

    // Insert into `patient_analysis`
    const patientData = JSON.stringify({ idnumber, idtype, name, lastname, phone, email, birthdate, gender, age });

    await connection.query(
      `INSERT INTO patient_analysis (patient_id, patient_data, created_at) VALUES (?, ?, NOW())`,
      [personId, patientData]
    );

    await connection.commit();
    res.status(201).json({ message: "Patient created successfully", patient_id: personId });

  } catch (error) {
    await connection.rollback();
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to create patient" });

  } finally {
    connection.release();
  }
});


// Editar paciente
router.post("/edit/:patient_id", async (req, res) => {
  const { patient_id } = req.params;
  const { name, lastname, idnumber, idtype, birthdate, age, phone, email, gender } = req.body;

  if (!patient_id) {
    return res.status(400).json({ error: "patient_id is required" });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Verificar si el paciente existe
    const [existingPatient] = await connection.query(
      `SELECT * FROM person WHERE person_id = ?`,
      [patient_id]
    );

    if (existingPatient.length === 0) {
      connection.release();
      return res.status(404).json({ error: "Patient not found" });
    }

    // Actualizar la tabla `person` si se proporciona género o fecha de nacimiento
    if (gender || birthdate) {
      await connection.query(
        `UPDATE person SET gender = ?, birthdate = ? WHERE person_id = ?`,
        [gender, birthdate, patient_id]
      );
    }

    // Obtener los datos actuales de `patient_analysis`
    const [patientAnalysis] = await connection.query(
      `SELECT patient_data FROM patient_analysis WHERE patient_id = ?`,
      [patient_id]
    );

    if (patientAnalysis.length > 0) {
      let patientData = JSON.parse(patientAnalysis[0].patient_data);

      // Actualizar solo los campos proporcionados
      patientData = {
        ...patientData,
        name: name || patientData.name,
        lastname: lastname || patientData.lastname,
        idnumber: idnumber || patientData.idnumber,
        idtype: idtype || patientData.idtype,
        birthdate: birthdate || patientData.birthdate,
        age: age || patientData.age,
        phone: phone || patientData.phone,
        email: email || patientData.email,
        gender: gender || patientData.gender
      };

      // Guardar los datos actualizados en `patient_analysis`
      await connection.query(
        `UPDATE patient_analysis SET patient_data = ? WHERE patient_id = ?`,
        [JSON.stringify(patientData), patient_id]
      );
    }

    await connection.commit();
    res.status(200).json({ message: "Patient updated successfully" });

  } catch (error) {
    await connection.rollback();
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to update patient" });

  } finally {
    connection.release();
  }
});


// Get all patients
router.get("/patients", async (req, res) => {
  try {
    const { search } = req.query;

    // Consulta base
    let query = "SELECT patient_id, patient_data, consultation FROM patient_analysis";
    let params = [];

    // Filtrar por nombre o ID si se proporciona un término de búsqueda
    if (search) {
      query += " WHERE patient_data LIKE ? OR patient_id = ?";
      params = [`%${search}%`, search];
    }
    // console.log('query: ', query);
    // console.log('params: ', params);

    const patients = await pool.query(query, params);
    // console.log(patients);


    // Desencriptar la información de cada paciente antes de enviarla al frontend
    const decryptedPatients = patients[0].map((patient) => ({
      patient_id: patient.patient_id,
      patient_data: patient.patient_data, // Aquí se desencripta
      consultation: patient.consultation ? decrypt(patient.consultation) : "No disponible",
    }));

    res.json(decryptedPatients);
  } catch (error) {
    console.error("Error obteniendo pacientes:", error);
    res.status(500).json({ error: "Error obteniendo pacientes" });
  }
});


// Obtener la consulta existente para formulario de Consulta
router.get("/patient-analysis/:patientId", async (req, res) => {
  const { patientId } = req.params;
  const data = {
    patient_data: "",
    consultation: "",
    general_records: "",
    personal_records: "",
    relational_records: "",
    physical_exam: "",
    neurological_exam: "",
    created_at: "",
  };

  try {
    const [rows] = await pool.query(
      `SELECT * FROM patient_analysis WHERE patient_id = ?`,
      [patientId]
    );

    if (rows.length > 0) {
      // console.log(decrypt(rows[0].patient_data));
      Object.keys(rows[0]).forEach(key => {
        if (rows[0][key] && typeof rows[0][key] === "string") {
          try {
            if (rows[0][key].includes('idnumber')) {
              data[key] = rows[0][key];
            } else {
              data[key] = decrypt(rows[0][key]); // Try to decrypt
            }
          } catch (error) {
            console.error(`Decryption failed for ${key}:`, error.message);
            // Keep the original encrypted value if decryption fails
          }
        }
        else if (rows[0][key] && typeof rows[0][key] === "object") {
          data[key] = rows[0][key];
        }
      });
      // console.log(data);

      res.json(data); // Devuelve la consulta almacenada
    } else {
      res.status(404).json({ error: "No data found" });
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});


// Guardar la consulta
router.post("/patient-analysis/saveConsultation", async (req, res) => {
  const { patient_id, consultation } = req.body;

  try {
    await pool.query(
      `UPDATE patient_analysis SET consultation = ? WHERE patient_id = ?`,
      [encrypt(consultation), patient_id]
    );

    res.json({ message: "Consultation saved successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to save consultation" });
  }
});


// Guardar la historia clínica
router.post("/patient-analysis/saveGeneralRecords", async (req, res) => {
  const { patient_id, general_records } = req.body;

  try {
    await pool.query(
      `UPDATE patient_analysis SET general_records = ? WHERE patient_id = ?`,
      [encrypt(general_records), patient_id]
    );

    res.json({ message: "Records saved successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to save records" });
  }
});


// Guardar los hábitos del paciente
router.post("/patient-analysis/savePersonalRecords", async (req, res) => {
  const { patient_id, personal_records } = req.body;

  try {
    await pool.query(
      `UPDATE patient_analysis SET personal_records = ? WHERE patient_id = ?`,
      [encrypt(personal_records), patient_id]
    );

    res.json({ message: "Records saved successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to save records" });
  }
});


// Guardar o actualizar gineco-obstetricos
router.post("/patient-analysis/saveRelationalRecords", async (req, res) => {
  const { patient_id, relational_records } = req.body;

  try {
    await pool.query(
      `UPDATE patient_analysis SET relational_records = ? WHERE patient_id = ?`,
      [encrypt(relational_records), patient_id]
    );

    res.json({ message: "Records saved successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to save records" });
  }
});


// Guardar o actualizar examen físico
router.post("/patient-analysis/savePhysicalExam", async (req, res) => {
  const { patient_id, physical_exam_records } = req.body;

  try {
    await pool.query(
      `UPDATE patient_analysis SET physical_exam = ? WHERE patient_id = ?`,
      [encrypt(physical_exam_records), patient_id]
    );

    res.json({ message: "Records saved successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to save records" });
  }
});


// Guardar examen neurológico
router.post("/patient-analysis/saveNeurologicalExam", async (req, res) => {
  const { patient_id, ...neurologicalExamData } = req.body;

  try {
    await pool.query(
      `UPDATE patient_analysis SET neurological_exam = ? WHERE patient_id = ?`,
      [encrypt(JSON.stringify(neurologicalExamData)), patient_id]
    );

    res.json({ message: "Examen neurológico guardado correctamente" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Error al guardar el examen neurológico" });
  }
});


// Manejo de archivos
router.post('/patient-analysis/upload', upload.array('files'), async (req, res) => {
  const patient_id = req.body.patientId;
  // const fileUploaded = req.files;

  try {
    await pool.query(
      `UPDATE patient_analysis SET file_records = ? WHERE patient_id = ?`,
      [encrypt(`uploads/${patient_id}`), patient_id]
    );

    res.json({ message: "Archivo guardado correctamente" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Error al guardar el archivo" });
  }
});


// Listado de archivos
router.get('/patient-analysis/files/:patientId', async (req, res) => {
  const folderPath = path.join(__dirname, `../uploads/${req.params.patientId}`);

  if (!fs.existsSync(folderPath)) {
    return res.json("Error 404")
  }
  try {
    const files = await fs.promises.readdir(folderPath);
    const basePath = `${req.protocol}://${req.get('host')}`
    const fileList = files.map(file => ({
      name: file,
      path: `${basePath}/static/${req.params.patientId}/${file}`
    }))
    res.json({ files: fileList });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Error al guardar el archivo" });
  }
});


module.exports = router;