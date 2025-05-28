import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SideBar from './components/sideBar/SideBar';
import Header from './components/header/Header';
import AddPatientCard from './components/patients/AddPatient';
import PatientsList from './components/patients/PatientsList';
import PatientDetails from './components/patients/PatientDetails/PatientDetails';
import Overview from './components/overview/Overview';
import './index.css';
import './App.css';

const App = () => {
  
  return (
    <div className="main-container">
      <div className="scrollable_main">
        <SideBar />
        <Header />
        <Routes>
          <Route exact path="/" index element={<Overview />} />
          <Route exact path="/patients" index element={<PatientsList />} />
          <Route exact path="/add-patient" index element={<AddPatientCard />} />
          <Route
            exact
            path="/patients/:id"
            index
            element={<PatientDetails />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
