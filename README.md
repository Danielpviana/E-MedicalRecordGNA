# 🏥 E-MedicalRecordGNA

**E-MedicalRecordGNA** es una aplicación web desarrollada con React y Tailwind CSS que permite la gestión de historias clínicas electrónicas. Este proyecto tiene como objetivo proporcionar una plataforma sencilla y eficiente para el registro y consulta de datos médicos de pacientes.

## 🚀 Características

- Registro y actualización de información médica de pacientes.
- Interfaz de usuario responsiva y amigable.
- Estructura modular para facilitar el mantenimiento y escalabilidad.

## 🛠️ Tecnologías Utilizadas

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Create React App](https://create-react-app.dev/)

## 📦 Instalación

1. Clona el repositorio:

```
git clone https://github.com/Danielpviana/E-MedicalRecordGNA.git
cd E-MedicalRecordGNA
```
2. Instala las dependencias:

```
npm install
```

3. Inicia la aplicación en modo desarrollo:

```
npm start
```

4. Instalar dependencias del backend

```
cd \backend
```
2. Instala las dependencias:

```
npm install
```

3. Inicia la aplicación en modo desarrollo:

```
node \server.js
```

La aplicación estará disponible en http://localhost:3000.

📁 Estructura del Proyecto
E-MedicalRecordGNA/

├── backend/            # Lógica del servidor (si aplica)

├── public/             # Archivos públicos

├── src/                # Código fuente de React

│   ├── components/     # Componentes reutilizables

│   ├── pages/          # Páginas de la aplicación

│   ├── services/       # Servicios y llamadas a APIs

│   └── App.js          # Componente principal

├── tailwind.config.js  # Configuración de Tailwind CSS

├── package.json        # Dependencias y scripts

└── README.md           # Documentación del proyecto


📄 Licencia
Este proyecto está bajo la licencia MIT.

---

## 📚 Documentación Técnica

### 1. Introducción

**E-MedicalRecordGNA** es una solución web para la gestión de historias clínicas electrónicas, facilitando el registro, actualización y consulta de información médica de pacientes. Está diseñada para ser intuitiva y adaptable a diferentes dispositivos.

### 2. Requisitos Previos

- Node.js (versión 14 o superior)
- npm (versión 6 o superior)

### 3. Instalación y Ejecución

Sigue los pasos mencionados en el archivo `README.md` para clonar, instalar dependencias e iniciar la aplicación.

### 4. Estructura del Código

- **`src/components/`**: Contiene componentes reutilizables como formularios, botones y encabezados.
- **`src/pages/`**: Incluye las diferentes vistas o páginas de la aplicación, como la lista de pacientes y el formulario de registro.
- **`src/services/`**: Módulos encargados de la comunicación con APIs o servicios externos.
- **`tailwind.config.js`**: Configuración personalizada de Tailwind CSS para adaptar estilos según las necesidades del proyecto.

### 5. Estilos y Diseño

Se utiliza Tailwind CSS para el diseño y estilo de la aplicación, lo que permite una personalización rápida y coherente de la interfaz de usuario.

### 6. Despliegue

Para generar una versión de producción optimizada:

```
npm run build
```

Esto creará una carpeta build/ lista para ser desplegada en servicios como Netlify, Vercel o GitHub Pages.

### 7. Contribuciones
Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

Haz un fork del repositorio.

Crea una nueva rama: git checkout -b feature/nueva-funcionalidad.

Realiza tus cambios y haz commit: git commit -m 'Agrega nueva funcionalidad'.

Sube tus cambios: git push origin feature/nueva-funcionalidad.

Abre un Pull Request detallando los cambios realizados.
