import React from 'react';
import doctorAvatar from '../../assets/doctor-avatar.webp';
import classes from './Header.module.css';

const Header = () => {
  const doctorName = 'Admin';
  const doctorSpeciality = 'Neurólogo';
  return (
    <div className={classes.header}>
      <div className={classes.doctor_details}>
        <div className={classes.name_image_cont}>
          <img
            src={doctorAvatar}
            alt="doctor avatar"
            className={classes.doctor_avatar}
          />
          <h2 className={classes.doctor_names}>Dr. {doctorName}</h2>
        </div>
        <div className={classes.name_icon_cont}>
          <h2 className={classes.doctor_names}>{doctorSpeciality}</h2>
          <span className={classes.heading}>Especialidad</span>
        </div>
      </div>
      
    </div>
  );
};

export default Header;