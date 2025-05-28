import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  patients: [],
  patient: [],
  searchResult: {},
  status: 'idle',
  error: null,
};

// Fetch patients from the server
export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async () => {
    try {
      const response = await axios.get('http://localhost:8080/patients/list');
      return response.data.patients;
    } catch (error) {
      throw new Error('Failed to fetch patients');
    }
  }
);

// Fetch patient from the server
export const fetchSinglePatient = createAsyncThunk(
  'patient/fetchSinglePatient',
  async (patientId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/patients/patient/${patientId}`
      );
      return response.data.patient;
    } catch (error) {
      throw new Error('Failed to fetch patient');
    }
  }
);

// Search patient from the server
export const searchPatient = createAsyncThunk(
  'searchResult/searchPatient',
  async (idNumber) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/patients/query/${idNumber}`
      );
      return response.data;
    } catch (error) {
      const response = error.response.data.message;
      throw new Error(response);
    }
  }
);

// Create a patient
export const createPatient = createAsyncThunk(
  'patients/createPatient',
  async (patientData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://localhost:8080/patients/post',
        patientData
      );
      return response.data.patient;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Define the patients slice
const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    clearSearchResult: (state) => {
      state.searchResult = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle the pending state while fetching patients
    builder.addCase(fetchPatients.pending, (state) => {
      state.status = 'loading';
    });

    // Handle the success state after fetching patients
    builder.addCase(fetchPatients.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.patients = action.payload;
    });

    // Handle the error state if fetching patients fails
    builder.addCase(fetchPatients.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });

    // Handle the pending state while fetching a single patient
    builder.addCase(fetchSinglePatient.pending, (state) => {
      state.status = 'loading';
    });

    // Handle the success state after fetching a single patient
    builder.addCase(fetchSinglePatient.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.patient = action.payload;
    });

    // Handle the error state if fetching a single patient fails
    builder.addCase(fetchSinglePatient.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });

    // Handle the pending state while searching for a patient
    builder.addCase(searchPatient.pending, (state) => {
      state.status = 'loading';
    });

    // Handle the success state after searching for a patient
    builder.addCase(searchPatient.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.searchResult = action.payload;
    });

    // Handle the error state if searching for a patient fails
    builder.addCase(searchPatient.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });

    // Handle the pending state while creating a patient
    builder.addCase(createPatient.pending, (state) => {
      state.status = 'loading';
    });

    // Handle the success state after creating a patient
    builder.addCase(createPatient.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.patients.push(action.payload);
    });

    // Handle the error state if creating a patient fails
    builder.addCase(createPatient.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload.message;
    });
  },
});

export const { clearSearchResult } = patientsSlice.actions;

export default patientsSlice.reducer;
