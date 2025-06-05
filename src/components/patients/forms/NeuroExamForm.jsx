import { useState, useEffect } from "react";
import axios from "axios";

export default function NeurologicalExamForm({ patientId }) {
  const [formData, setFormData] = useState({
    estadoConciencia: "",
    orientacionTiempo: "",
    orientacionEspacio: "",
    otrasObservaciones: "",
  });

  // console.log(formData);

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/patient-analysis/${patientId}`);
        if (response.data.neurological_exam) {
          setFormData(JSON.parse(response.data.neurological_exam));
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendNeuroData = async () => {
    try {
      await axios.post("http://localhost:5000/api/patient-analysis/saveNeurologicalExam", { patient_id: patientId, ...formData });
      alert("Datos guardados correctamente");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar los datos");
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white">
      <div className="space-y-6">
        {/* SECCIÓN: Conciencia y Orientación */}
        <div>
          <h2 className="text-lg font-bold mb-4 text-gray-700">Conciencia y Orientación</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "estadoConciencia", label: "Estado de conciencia", placeholder: "Ej: Alerta, somnoliento" },
              { name: "orientacionTiempo", label: "Orientación en tiempo", placeholder: "Ej: Orientado / Desorientado" },
              { name: "orientacionEspacio", label: "Orientación en espacio", placeholder: "Ej: Orientado / Desorientado" },
            ].map((field, index) => (
              <div key={index}>
                <label className="font-semibold text-gray-700">{field.label}:</label>
                <input name={field.name} value={formData[field.name]} onChange={handleChange} placeholder={field.placeholder} className="border p-2 w-full rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* SECCIÓN: Otras Observaciones */}
        <div>
          <h2 className="text-lg font-bold mb-4 text-gray-700">Otras Observaciones</h2>
          <textarea name="otrasObservaciones" value={formData.otrasObservaciones} onChange={handleChange} placeholder="Escribe cualquier otra observación relevante..." className="border p-2 w-full rounded h-24" />
        </div>

        {/* Botón de Guardar */}
        <div className="text-center">
          <button onClick={sendNeuroData} className="border px-4 py-2 mt-4 rounded bg-[#026937] text-white shadow-md hover:bg-[#2d9160] transition">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
