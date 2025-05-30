import { useState, useEffect } from "react";
import axios from "axios";

export default function FileUpload({ patientId }) {
  const [fileData, setFileData] = useState();

  // console.log(formData);

  // useEffect(() => {
  //   const fetchConsultation = async () => {
  //     try {
  //       const response = await axios.get(`http://localhost:5000/api/patient-analysis/${patientId}`);
  //       if (response.data.physical_exam) {
  //         setFormData(JSON.parse(response.data.physical_exam));
  //       }
  //     } catch (error) {
  //       console.error("Error fetching consultation:", error);
  //     }
  //   };
  //   if (patientId) {
  //     fetchConsultation();
  //   }
  // }, [patientId]);

  const handleChange = (e) => {
    setFileData(e.target.files[0]);
  };

  const sendFile = async (e) => {
    e.preventDefault();
    var fileForm = new FormData();
    // console.log(fileData);
    fileForm.append("file", fileData);
    fileForm.append("patientId", patientId);

    try {
      await axios.post("http://localhost:5000/api/patient-analysis/upload", fileForm);

      alert("Archivos guardados correctamente.");
    } catch (error) {
      console.error("Error al guardar los archivos:", error);
      alert("No se pudo guardar la información.");
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white">
      <form className="space-y-6">
        <h2 className="text-lg font-bold mb-4 text-gray-700">Cargue de archivos</h2>
        <div>
          <label className="font-semibold text-gray-700">Cargar archivos de estudios/bioseñales</label>
          <input
            id="fileInput"
            type="file"
            name="file"
            onChange={handleChange}
            placeholder="Subir archivo"
            className="border p-2 w-full rounded"
          />
        </div>

        <div className="text-center">
          <button
            onClick={sendFile}
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
