import { useState, useEffect } from "react";
import axios from "axios";

export default function HabitsForm({ patientId }) {
  const [formData, setFormData] = useState({
    tabaquismo: "",
    alcoholismo: "",
    cafe: "",
    te: "",
    drogas: "",
  });

  //console.log(formData);

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/patient-analysis/${patientId}`);
        if (response.data.personal_records) {
          setFormData(JSON.parse(response.data.personal_records));
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

  const sendHabitsData = async () => {
    const habitsData = JSON.stringify(formData);

    try {
      await axios.post("http://localhost:5000/api/patient-analysis/savePersonalRecords", {
        patient_id: patientId,
        personal_records: habitsData,
      });

      alert("Hábitos guardados correctamente.");
    } catch (error) {
      console.error("Error saving habits:", error);
      alert("No se pudo guardar la información.");
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-lg font-bold mb-4 text-gray-700">Antecedentes personales</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: "Tabaquismo", name: "tabaquismo" },
            { label: "Alcoholismo", name: "alcoholismo" },
            { label: "Café", name: "cafe" },
            { label: "Té", name: "te" },
            { label: "Drogas", name: "drogas" },
          ].map((field, index) => (
            <div key={index}>
              <label className="font-semibold">{field.label}:</label>
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

        <div className="text-center">
          <button onClick={sendHabitsData} className="border px-4 py-2 mt-4 rounded bg-[#026937] text-white shadow-md hover:bg-[#2d9160] transition">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
