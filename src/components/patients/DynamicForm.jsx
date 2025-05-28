import ConsultationForm from "./forms/ConsultationForm";
import PersonalHistoryForm from "./forms/PersonalHistoryForm";
import HabitsForm from "./forms/HabitsForm";
import GinecoForm from "./forms/GinecoForm";
import PhysicalExamForm from "./forms/PhysicalExam";
import NeurologicalExamForm from "./forms/NeuroExamForm";
import FileUpload from "./forms/FileUpload";

const formComponents = {
  "Consulta": ConsultationForm,
  "Ant. generales": PersonalHistoryForm,
  "Ant. personales": HabitsForm,
  "Ant. sexuales": GinecoForm,
  "Examen físico": PhysicalExamForm,
  "Examen neurológico": NeurologicalExamForm,
  "Subir archivos": FileUpload,
};

export default function DynamicForm({ activeTab, patientId }) {
  const FormComponent = formComponents[activeTab] || (() => <p>No form available.</p>);
  return <FormComponent patientId={patientId} />;
}
