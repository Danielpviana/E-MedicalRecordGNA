import React, { useState, useEffect } from "react";
import SinglePatient from './SinglePatient';
import classes from './PatientsList.module.css';

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Función para obtener los pacientes desde el backend
  const fetchPatients = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/patients?search=${searchTerm}`);
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error("Error obteniendo los pacientes:", error);
    }
  };

  // Llamar a la API cuando se monta el componente o cambia el filtro
  useEffect(() => {
    fetchPatients();
  });

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
      <div className={classes.patients_list_container}>
        <h2 className="text-lg font-bold mb-4 text-gray-700">Listado de pacientes</h2>
        <div className="m-2">
          <input
            type="text"
            placeholder="Buscar por documento o nombre"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={classes.search_input}
          />
          <button type="submit" className={classes.search_btn}>
            Buscar
          </button>
        </div>

        <table className={classes.table}>
          <thead className={classes.thead}>
            <tr className={classes.table_header}>
              <th className={classes.table_header_col}>Tipo documento</th>
              <th className={classes.table_header_col}>Número documento</th>
              <th className={classes.table_header_col}>Nombre</th>
              <th className={classes.table_header_col}>Apellido</th>
              <th className={classes.table_header_col}>Género</th>
              <th className={classes.table_header_col}>Fecha nacimiento</th>
              <th className={classes.table_header_col}>Edad</th>
              <th className={classes.table_header_col}>Motivo de consulta</th>
              <th className={classes.table_header_col}>Acciones</th>
            </tr>
          </thead>
          <tbody className={classes.patients_list}>
            {
              patients.map((patient) => (
                <SinglePatient patient={patient} key={patient.patient_id}
                />
              ))
            }
          </tbody>
        </table>
      </div>
    </div >
  );
};

export default PatientsList;