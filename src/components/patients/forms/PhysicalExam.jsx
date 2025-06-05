import { useState, useEffect } from "react";
import axios from "axios";

export default function PhysicalExamForm({ patientId }) {
  const [formData, setFormData] = useState({
    presionArterial: "",
    frecuenciaCardiaca: "",
    frecuenciaRespiratoria: "",
    temperatura: "",
    saturacionOxigeno: "",
    indiceMasaCorporal: "",
    observacionesSignosVitales: "",
    cabeza: "",
    cuello: "",
    torax: "",
    abdomen: "",
    extremidades: "",
    piel: "",
    otrasObservaciones: "",
  });

  // console.log(formData);

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/patient-analysis/${patientId}`);
        if (response.data.physical_exam) {
          setFormData(JSON.parse(response.data.physical_exam));
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

  const sendPhysicalExamData = async () => {
    const physicalExamData = JSON.stringify(formData);

    try {
      await axios.post("http://localhost:5000/api/patient-analysis/savePhysicalExam", {
        patient_id: patientId,
        physical_exam_records: physicalExamData,
      });

      alert("Datos guardados correctamente.");
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      alert("No se pudo guardar la información.");
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold mb-4 text-gray-700">Signos Vitales</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "presionArterial", label: "Presión Arterial", placeholder: "Ej: 120/80 mmHg" },
              { name: "frecuenciaCardiaca", label: "Frecuencia Cardíaca", placeholder: "Ej: 72 bpm" },
              { name: "frecuenciaRespiratoria", label: "Frecuencia Respiratoria", placeholder: "Ej: 16 rpm" },
              { name: "temperatura", label: "Temperatura", placeholder: "Ej: 36.5" },
              { name: "saturacionOxigeno", label: "Saturación de Oxígeno", placeholder: "Ej: 98%" },
              { name: "indiceMasaCorporal", label: "Índice de Masa Corporal", placeholder: "Ej: 24.5" },
            ].map((field, index) => (
              <div key={index}>
                <label className="font-semibold text-gray-700">{field.label}:</label>
                <input
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="border p-2 w-full rounded"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="font-semibold text-gray-700">Observaciones</label>
          <textarea
            name="observacionesSignosVitales"
            value={formData.observacionesSignosVitales}
            onChange={handleChange}
            placeholder="Ej: Posición de toma de presión arterial y otras observaciones"
            className="border p-2 w-full rounded h-24"
          />
        </div>

        <div>
          <h2 className="text-lg font-bold mb-4 text-gray-700">Exploración Física</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "cabeza", label: "Cabeza", placeholder: "Observaciones" },
              { name: "cuello", label: "Cuello", placeholder: "Observaciones" },
              { name: "torax", label: "Tórax", placeholder: "Observaciones" },
              { name: "abdomen", label: "Abdomen", placeholder: "Observaciones" },
              { name: "extremidades", label: "Extremidades", placeholder: "Observaciones" },
              { name: "piel", label: "Piel", placeholder: "Observaciones" },
            ].map((field, index) => (
              <div key={index}>
                <label className="font-semibold text-gray-700">{field.label}:</label>
                <input
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="border p-2 w-full rounded"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-4 text-gray-700">Otras Observaciones</h2>
          <textarea
            name="otrasObservaciones"
            value={formData.otrasObservaciones}
            onChange={handleChange}
            placeholder="Escribe cualquier otra observación relevante..."
            className="border p-2 w-full rounded h-24"
          />
        </div>

        <div className="text-center">
          <button
            onClick={sendPhysicalExamData}
            className="border px-4 py-2 mt-4 rounded bg-[#026937] text-white shadow-md hover:bg-[#2d9160] transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
