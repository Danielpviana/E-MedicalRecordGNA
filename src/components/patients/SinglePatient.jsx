import React from 'react';
import { Link } from 'react-router-dom';
import classes from './SinglePatient.module.css';

const SinglePatient = ({ patient }) => {

  return (
    <tr key={patient.patient_id} className={classes.table_body_row}>
      <td className={classes.table_body_col}>{patient.patient_data ? JSON.parse(patient.patient_data).idtype : "Sin datos"}</td>
      <td className={classes.table_body_col}>{patient.patient_data ? JSON.parse(patient.patient_data).idnumber : "Sin datos"}</td>
      <td className={classes.table_body_col}>{patient.patient_data ? JSON.parse(patient.patient_data).name : "Sin datos"}</td>
      <td className={classes.table_body_col}>{patient.patient_data ? JSON.parse(patient.patient_data).lastname : "Sin datos"}</td>
      <td className={classes.table_body_col}>{patient.patient_data ? JSON.parse(patient.patient_data).gender : "Sin datos"}</td>
      <td className={classes.table_body_col}>{patient.patient_data ? JSON.parse(patient.patient_data).birthdate : "Sin datos"}</td>
      <td className={classes.table_body_col}>{patient.patient_data ? JSON.parse(patient.patient_data).age : "Sin datos"}</td>
      <td className={classes.table_body_col}>{patient.consultation !== "No disponible" ? JSON.parse(patient.consultation).motivoConsulta : "Sin datos"}</td>
      <td className={classes.table_body_col}>
        <Link to={`/patients/${patient.patient_id}`} className={classes.view_btn}>
          Editar
        </Link>
      </td>
    </tr>
  );
};

export default SinglePatient;
