import { useState, useEffect } from "react";
import axios from "axios";

export default function PersonalHistoryForm({ patientId }) {
  const [formData, setFormData] = useState({
    patologicos: "",
    abuelos: "",
    padre: "",
    madre: "",
    hermanos: "",
    hijos: "",
    reaccionMedicamentos: "",
    alergias: "",
    transfusiones: "",
    traumatismos: "",
    quirurgicos: "",
    infecciosos: "",
    reproductivos: "",
    medicacion: "",
    vacunaciones: "",
    generoVida: "",
    alimentacion: "",
    vivienda: "",
    mascotas: "",
    tipoSuelo: "",
    tipoTecho: "",
    agua: "",
    serviciosSanitarios: "",
    banosDuchas: "",
    accesoInternet: "",
  });

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/patient-analysis/${patientId}`);
        if (response.data.general_records) {
          console.log(response.data.general_records);

          setFormData(JSON.parse(response.data.general_records));
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

  const sendPersonalHistoryData = async () => {
    const generalRecordsData = JSON.stringify(formData);

    try {
      await axios.post("http://localhost:5000/api/patient-analysis/saveGeneralRecords", {
        patient_id: patientId,
        general_records: generalRecordsData,
      });

      alert("Antecedentes guardados correctamente.");
    } catch (error) {
      console.error("Error saving general records:", error);
      alert("No se pudo guardar los antecedentes.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Antecedentes Personales Patológicos */}
        <div className="p-4 border rounded-lg shadow-md bg-white">
          <h2 className="text-lg font-bold mb-4 text-gray-700">Antecedentes patológicos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Patológicos", name: "patologicos" },
              { label: "Abuelos/as", name: "abuelos" },
              { label: "Padre", name: "padre" },
              { label: "Madre", name: "madre" },
              { label: "Hermanos/as", name: "hermanos" },
              { label: "Hijos/as", name: "hijos" },
              { label: "Reacción a medicamentos", name: "reaccionMedicamentos" },
              { label: "Alergias", name: "alergias" },
              { label: "Transfusiones sanguíneas", name: "transfusiones" },
              { label: "Traumatismos", name: "traumatismos" },
              { label: "Quirúrgicos", name: "quirurgicos" },
              { label: "Infecciosos", name: "infecciosos" },
              { label: "Reproductivos", name: "reproductivos" },
              { label: "Medicación", name: "medicacion" },
            ].map((field, index) => (
              <div key={index}>
                <label className="font-semibold text-gray-700">{field.label}:</label>
                <input
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder="Antecedentes"
                  className="border p-2 w-full rounded"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Antecedentes Personales No Patológicos */}
        <div className="p-4 border rounded-lg shadow-md bg-white">
          <h2 className="text-lg font-bold mb-4 text-gray-700">Antecedentes no patológicos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Vacunaciones recibidas", name: "vacunaciones" },
              { label: "Género de vida", name: "generoVida" },
              { label: "Alimentación", name: "alimentacion" },
              { label: "Vivienda", name: "vivienda" },
              { label: "Mascotas", name: "mascotas" },
              { label: "Tipo de suelo", name: "tipoSuelo" },
              { label: "Tipo de techo", name: "tipoTecho" },
              { label: "Agua", name: "agua" },
              { label: "Servicios sanitarios", name: "serviciosSanitarios" },
              { label: "Baños/duchas", name: "banosDuchas" },
              { label: "Acceso a internet", name: "accesoInternet" },
            ].map((field, index) => (
              <div key={index}>
                <label className="font-semibold text-gray-700">{field.label}:</label>
                <input
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder="Estado"
                  className="border p-2 w-full rounded"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Botón de Guardar */}
      <div className="text-center">
        <button
          type="button"
          onClick={sendPersonalHistoryData} // ✅ Corrección aquí
          className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
