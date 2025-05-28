import { configureStore } from '@reduxjs/toolkit';
import AuthenticationReducer from './authenticationSlice';
import SideBarReducer from './sideBarSlice';
import PatientsReducer from './patientsSlice';
import MedicalRecodsReducer from './medicalRecords';

const store = configureStore({
  reducer: {
    auth: AuthenticationReducer,
    nav: SideBarReducer,
    pat: PatientsReducer,
    medicalRecords: MedicalRecodsReducer,
  },
});

export default store;
