const express = require("express");
const cors = require("cors");
const settings = require('./env.js');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/static', express.static('uploads'))

// Import routes
const patientRoutes = require("./routes/patientRoutes"); // Create this file

app.use("/api", patientRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Start server
const PORT = settings.port || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
