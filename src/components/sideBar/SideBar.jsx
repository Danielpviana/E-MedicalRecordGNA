import { useState } from "react";
import { Link } from "react-router-dom";
import { AiFillHome, AiFillSchedule } from "react-icons/ai";
import { SlCalender } from "react-icons/sl";
import { FaUserCog } from "react-icons/fa";
import { FcStatistics } from "react-icons/fc";
import { BiSolidLogOut } from "react-icons/bi";
import { Menu, X } from "lucide-react";
import logo from "../../assets/gna-logo.png";

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón para abrir el Sidebar en móviles */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-[#026937] text-white rounded md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0 h-full w-48 bg-[#026937] shadow-md transform 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform 
        md:translate-x-0 md:w-56 lg:w-64 p-2 space-y-4 overflow-y-auto`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center p-2">
          <Link to="/" className="">
            <img src={logo} alt="logo" className="w-30 h-auto bg-white rounded" />
          </Link>
        </div>

        <div className="space-y-4 text-sm">
          {/* Sección Inicio */}
          <div>
            <p className="text-white font-semibold px-2 mb-1">INICIO</p>
            <Link to="/" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-200 text-white hover:text-black">
              <AiFillHome size={20} />
              <p>Overview</p>
            </Link>
          </div>

          {/* Sección Pacientes */}
          <div>
            <p className="text-white font-semibold px-2 mb-1">PACIENTES</p>
            <Link to="/patients" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-200 text-white hover:text-black">
              <SlCalender size={20} />
              <p>Lista</p>
            </Link>
            <Link to="/add-patient" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-200 text-white hover:text-black">
              <AiFillSchedule size={20} />
              <p>Agregar</p>
            </Link>
            <Link to="/patients" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-200 text-white hover:text-black">
              <AiFillSchedule size={20} />
              <p>Editar</p>
            </Link>
          </div>

          {/* Sección Perfil */}
          <div>
            <p className="text-white font-semibold px-2 mb-1">PERFIL</p>
            <Link to="/profile/:id" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-200 text-white hover:text-black">
              <FaUserCog size={20} />
              <p>Detalles</p>
            </Link>
            <Link to="/settings" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-200 text-white hover:text-black">
              <FcStatistics size={20} />
              <p>Ajustes</p>
            </Link>
            <Link to="/logout" className="flex items-center space-x-2 p-2 rounded text-red-500 hover:bg-red-400">
              <BiSolidLogOut size={20} />
              <p className="text-white">Salir</p>
            </Link>
          </div>
        </div>
      </nav>

      {/* Fondo oscuro cuando el Sidebar está abierto */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
