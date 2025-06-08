import { useState, useEffect } from "react";
import axios from "axios";

export default function FileUpload({ patientId }) {
  const [fileData, setFileData] = useState();
  const [files, setFiles] = useState();

  // console.log(formData);

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/patient-analysis/files/${patientId}`);
        if (response) {
          setFiles(response.data.files);
        }
      } catch (error) {
        console.error("Error fetching consultation:", error);
      }
    };
    if (patientId) {
      fetchConsultation();
    }
  }, [patientId]);

  const handleChange = (e) => {
    setFileData(e.target.files);
  };

  const downloadFile = async (path, fileName) => {
    const response = await axios.get(path, { responseType: 'blob' })
    const blobUrl = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = blobUrl
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const sendFile = async (e) => {
    // e.preventDefault();
    var fileForm = new FormData();
    // console.log(fileData);
    // fileForm.append("file", fileData);
    fileForm.append("patientId", patientId);

    Array.from(fileData).forEach(file => (fileForm.append("files", file)))

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
            multiple
          />
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-bold mb-4 text-gray-700">Archivos cargados</h2>
          <ul>
            {files?.map(file => (
              <li className="flex items-center justify-between p-3 rounded-md mb-2" key={file.name}>
                <p className="text-gray-800 font-medium truncate">{file.name}</p>
                <div className="flex space-x-2">
                  <a
                    href={file.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition"
                  >
                    Ver
                  </a>
                  <button
                    onClick={() => downloadFile(file.path, file.name)}
                    className="px-3 py-1 bg-[#43b649] text-white text-sm rounded hover:bg-[#37973c] transition"
                  >
                    Descargar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <button
            onClick={sendFile}
            className="border px-4 py-2 mt-4 rounded bg-[#026937] text-white shadow-md hover:bg-[#2d9160] transition"
          >
            Guardar
          </button>
        </div>
      </form>

    </div>
  );
}
