import { useState, useEffect } from "react";
import axios from "axios";

export default function ConsultationForm({ patientId }) {
  const [formData, setFormData] = useState({
    motivoConsulta: "",
    enfermedadActual: "",
  });

  //console.log(formData);

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/patient-analysis/${patientId}`);
        if (response.data.consultation) {
          setFormData(JSON.parse(response.data.consultation));
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

  const sendConsultationData = async (e) => {
    e.preventDefault(); // Evita el recargo de la página

    const consultationData = JSON.stringify(formData);

    try {
      await axios.post("http://localhost:5000/api/patient-analysis/saveConsultation", {
        patient_id: patientId,
        consultation: consultationData,
      });

      alert("Consulta guardada correctamente.");
    } catch (error) {
      console.error("Error saving consultation:", error);
      alert("No se pudo guardar la consulta.");
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <form className="space-y-4">
      <h2 className="text-lg font-bold mb-4 text-gray-700">Información general de la consulta</h2>
        <div>
          <label className="font-semibold">Motivo de consulta:</label>
          <input
            name="motivoConsulta"
            value={formData.motivoConsulta}
            onChange={handleChange}
            placeholder="Justificación"
            className="border mb-2 p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="font-semibold mt-2 py-2">Enfermedad actual:</label>
          <textarea
            name="enfermedadActual"
            value={formData.enfermedadActual}
            onChange={handleChange}
            placeholder="Historia actual"
            className="border mb-2 p-2 w-full rounded"
          />
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={sendConsultationData} // ✅ Aquí se corrige
            className="border px-4 py-2 mt-4 rounded bg-[#026937] text-white shadow-md hover:bg-[#2d9160] transition"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
