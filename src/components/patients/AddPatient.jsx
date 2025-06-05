import { useState } from "react";
import axios from "axios";
import DynamicForm from "./DynamicForm";

export default function AddPatientCard() {
  const [activeTab, setActiveTab] = useState("Consulta");
  const [formData, setFormData] = useState({
    idnumber: "",
    idtype: "",
    name: "",
    lastname: "",
    birthdate: "",
    age: "",
    phone: "",
    email: "",
    gender: "",
  });
  const [patientId, setPatientId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBirthChange = (e) => {
    // setFormData({ ...formData, [e.target.name]: e.target.value });
    const birthdate = e.target.value;

    // Calculate age based on birthdate
    const birthDateObj = new Date(birthdate);
    const today = new Date();

    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    // Adjust age if the birthdate hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }

    // Update formData with both birthdate and calculated age
    setFormData({ ...formData, birthdate: birthdate, age: age });
    console.log(formData);

  };

  const handleGenderChange = (e) => {
    setFormData({ ...formData, gender: e.target.value });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await axios.post("http://localhost:5000/api/add", formData);
      const newPatientId = response.data.patient_id;

      setPatientId(newPatientId);
      console.log(formData);

      alert(`Patient added successfully!`);

    } catch (error) {
      console.error("Error saving patient:", error);
      alert("Failed to save patient.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-xl font-bold">Ficha Paciente</h2>
      </div>

      {/* Patient Info */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <label className="font-semibold">Nombre:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="border p-2 w-full" disabled={patientId !== null} />
        </div>
        <div>
          <label className="font-semibold">Apellidos:</label>
          <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} className="border p-2 w-full" disabled={patientId !== null} />
        </div>
        <div>
          <label className="font-semibold">Identificación:</label>
          <input type="text" name="idnumber" value={formData.idnumber} onChange={handleChange} className="border p-2 w-full" disabled={patientId !== null} />
        </div>
        <div>
          <label className="font-semibold">Tipo de identificación:</label>
          <input type="text" name="idtype" value={formData.idtype} onChange={handleChange} className="border p-2 w-full" disabled={patientId !== null} />
        </div>
        <div>
          <label className="font-semibold">Nacimiento:</label>
          <input type="date" name="birthdate" value={formData.birthdate} onChange={handleBirthChange} className="border p-2 w-full" disabled={patientId !== null} />
        </div>
        <div>
          <label className="font-semibold">Edad:</label>
          <input type="number" onChange={handleChange} name="age" value={formData.age} className="border p-2 w-full" disabled={true} />
        </div>
        <div>
          <label className="font-semibold">Teléfono:</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="border p-2 w-full" disabled={patientId !== null} />
        </div>
        <div>
          <label className="font-semibold">Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="border p-2 w-full" disabled={patientId !== null} />
        </div>
        <div className="col-span-2">
          <label className="font-semibold">Género:</label>
          <div className="flex gap-4 mt-1">
            <label className="flex items-center">
              <input type="radio" name="gender" value="M" checked={formData.gender === "M"} onChange={handleGenderChange} className="mr-2" disabled={patientId !== null} />
              Masculino
            </label>
            <label className="flex items-center">
              <input type="radio" name="gender" value="F" checked={formData.gender === "F"} onChange={handleGenderChange} className="mr-2" disabled={patientId !== null} />
              Femenino
            </label>
            <label className="flex items-center">
              <input type="radio" name="gender" value="O" checked={formData.gender === "O"} onChange={handleGenderChange} className="mr-2" disabled={patientId !== null} />
              Otro
            </label>
          </div>
          <div className="flex justify-center items-center m-4 border-t pb-2">
            <button
              onClick={handleSubmit}
              className={`border px-4 py-2 mt-4 rounded ${patientId ? "bg-gray-400 cursor-not-allowed" : "bg-[#026937] text-white"}`}
              disabled={patientId !== null}
            >
              {patientId ? "Paciente creado" : "Crear paciente"}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b flex gap-2 overflow-x-auto">
        {["Consulta", "Ant. generales", "Ant. personales", "Ant. sexuales", "Examen físico", "Examen neurológico", "Subir archivos"].map((tab) => (
          <button
            key={tab}
            className={`px-3 py-2 text-sm font-medium border-b-2 ${activeTab === tab ? "border-[#026937] text-[#026937]" : "border-transparent"}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4 bg-gray-50 mt-4 rounded-lg text-gray-600">
        <DynamicForm activeTab={activeTab} patientId={patientId} />
      </div>
    </div>
  );
}
