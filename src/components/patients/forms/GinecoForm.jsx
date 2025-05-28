import { useState, useEffect } from "react";
import axios from "axios";

export default function GinecoForm({ patientId }) {
  const [formData, setFormData] = useState({
    primerasRelacionesSexuales: "",
    vidaSexualActiva: "",
    numeroConyuges: "",
    preferenciasSexuales: "",
    relacionesExtramaritales: "",
    menarquia: "",
    cicloMenstrual: "",
    menopausia: "",
    fechaUltimaMenstruacion: "",
    numeroGestaciones: "",
  });

  // console.log(formData);

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/patient-analysis/${patientId}`);
        if (response.data.relational_records) {
          setFormData(JSON.parse(response.data.relational_records));
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

  const sendRelationalData = async () => {
    const relationalData = JSON.stringify(formData);

    try {
      await axios.post("http://localhost:5000/api/patient-analysis/saveRelationalRecords", {
        patient_id: patientId,
        relational_records: relationalData,
      });

      alert("Información guardada correctamente.");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("No se pudo guardar la información.");
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white">
      <div className="space-y-6">
        {/* Información General */}
        <div>
          <h2 className="text-lg font-bold mb-4 text-gray-700">Información General</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "primerasRelacionesSexuales", label: "Primeras relaciones sexuales", placeholder: "Edad" },
              { name: "vidaSexualActiva", label: "Vida sexual activa", placeholder: "Sí / No" },
              { name: "numeroConyuges", label: "Número de cónyuges", placeholder: "Cantidad" },
              { name: "preferenciasSexuales", label: "Preferencias sexuales", placeholder: "Sí / No" },
              { name: "relacionesExtramaritales", label: "Relaciones extramaritales", placeholder: "Sí / No" },
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

        {/* Historial Menstrual y Gestaciones */}
        <div>
          <h2 className="text-lg font-bold mb-4 text-gray-700">Historial Menstrual y Gestaciones</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "menarquia", label: "Menarquía", placeholder: "Edad" },
              { name: "cicloMenstrual", label: "Ciclo menstrual", placeholder: "Ciclo" },
              { name: "menopausia", label: "Menopausia", placeholder: "Edad" },
              { name: "fechaUltimaMenstruacion", label: "Fecha última menstruación", placeholder: "DD/MM/AAAA" },
              { name: "numeroGestaciones", label: "Número de gestaciones", placeholder: "Cantidad" },
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

        {/* Botón Guardar */}
        <div className="text-center">
          <button
            onClick={sendRelationalData}
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
