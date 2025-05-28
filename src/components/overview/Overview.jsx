import { Link } from "react-router-dom";
import { Calendar, UserPlus, Edit, User, Settings, LogOut } from "lucide-react";
// import { useState } from "react";

export default function Overview({ active }) {

  const menuItems = [
    { name: "Lista de pacientes", icon: Calendar, route: "/patients" },
    { name: "Agregar paciente", icon: UserPlus, route: "/add-patient" },
    { name: "Editar paciente", icon: Edit, route: "/patients" },
    { name: "Detalles", icon: User, route: "/profile/details" },
    { name: "Ajustes", icon: Settings, route: "/profile/settings" },
    { name: "Salir", icon: LogOut, route: "/logout", className: "text-red-600" },
  ];

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4">Menú Principal</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menuItems.map((item) => (
          <Link
            to={item.route}
            key={item.name}
            className={`p-4 border rounded-lg shadow hover:bg-gray-100 flex items-center gap-4 ${item.className || ""}`}
          >
            <item.icon size={24} className="text-gray-700" />
            <span className="text-lg font-semibold">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
