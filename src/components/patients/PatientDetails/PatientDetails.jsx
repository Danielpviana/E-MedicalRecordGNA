import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DynamicForm from "../DynamicForm";

export default function PatientDetails({ patientId }) {
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

  patientId = useParams().id;  
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [editPatient, setEditPatient] = useState(false);

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/patient-analysis/${patientId}`);
        if (response.data.patient_data) {
          setFormData(JSON.parse(response.data.patient_data));
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

  const handleBirthChange = (e) => {
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
  };

  const handleGenderChange = (e) => {
    setFormData({ ...formData, gender: e.target.value });
  };

  const handleEdit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await axios.post(`http://localhost:5000/api/edit/${patientId}`, formData);

      alert(`Patient edited successfully!`);

    } catch (error) {
      console.error("Error editing patient:", error);
      alert("Failed to edit patient.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-xl font-bold">Ficha Paciente</h2>
        <button
          onClick={handleEdit}
          className={`border px-4 py-2 rounded bg-blue-500 text-white`}
        >
          Editar paciente
        </button>
      </div>

      {/* Patient Info */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <label className="font-semibold">Nombre:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="border p-2 w-full"  />
        </div>
        <div>
          <label className="font-semibold">Apellidos:</label>
          <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} className="border p-2 w-full"  />
        </div>
        <div>
          <label className="font-semibold">Identificación:</label>
          <input type="text" name="idnumber" value={formData.idnumber} onChange={handleChange} className="border p-2 w-full"  />
        </div>
        <div>
          <label className="font-semibold">Tipo de identificación:</label>
          <input type="text" name="idtype" value={formData.idtype} onChange={handleChange} className="border p-2 w-full"  />
        </div>
        <div>
          <label className="font-semibold">Nacimiento:</label>
          <input type="date" name="birthdate" value={formData.birthdate} onChange={handleBirthChange} className="border p-2 w-full"  />
        </div>
        <div>
          <label className="font-semibold">Edad:</label>
          <input type="number" onChange={handleChange} name="age" value={formData.age} className="border p-2 w-full" disabled={true} />
        </div>
        <div>
          <label className="font-semibold">Teléfono:</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="border p-2 w-full"  />
        </div>
        <div>
          <label className="font-semibold">Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="border p-2 w-full"  />
        </div>
        <div className="col-span-2">
          <label className="font-semibold">Género:</label>
          <div className="flex gap-4 mt-1">
            <label className="flex items-center">
              <input type="radio" name="gender" value="M" checked={formData.gender === "M"} onChange={handleGenderChange} className="mr-2"  />
              Masculino
            </label>
            <label className="flex items-center">
              <input type="radio" name="gender" value="F" checked={formData.gender === "F"} onChange={handleGenderChange} className="mr-2"  />
              Femenino
            </label>
            <label className="flex items-center">
              <input type="radio" name="gender" value="O" checked={formData.gender === "O"} onChange={handleGenderChange} className="mr-2"  />
              Otro
            </label>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b flex gap-2 overflow-x-auto">
        {["Consulta", "Ant. generales", "Ant. personales", "Ant. sexuales", "Examen físico", "Examen neurológico", "Subir archivos"].map((tab) => (
          <button
            key={tab}
            className={`px-3 py-2 text-sm font-medium border-b-2 ${activeTab === tab ? "border-blue-500 text-blue-500" : "border-transparent"}`}
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
