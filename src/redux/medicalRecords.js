import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  medicalRecords: [],
  patientMedicalRecords: [],
  status: 'idle',
  error: null,
};

export const createMedicalRecord = createAsyncThunk(
  'medicalRecords/createMedicalRecords',
  async (medicalRecordData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://localhost:8080/medicalRecords/post',
        medicalRecordData
      );
      return response.data.medicalRecord;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchMedicalRecords = createAsyncThunk(
  'medicalRecords/fetchMedicalRecords',
  async (patientId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/medicalRecords/${patientId}`
      );
      return response.data.medicalRecord;
    } catch (error) {
      throw new Error('Failed to fetch Medical Records');
    }
  }
);

// Define the medical records slice
const medicalRecordsSlice = createSlice({
  name: 'medicalRecords',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle the pending state while fetching Medical Records
    builder.addCase(fetchMedicalRecords.pending, (state) => {
      state.status = 'loading';
    });

    // Handle the success state after fetching Medical Records
    builder.addCase(fetchMedicalRecords.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.patientMedicalRecords = action.payload;
    });

    // Handle the error state if fetching Medical Record fails
    builder.addCase(fetchMedicalRecords.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });

    // Handle the pending state while creating a Medical Record
    builder.addCase(createMedicalRecord.pending, (state) => {
      state.status = 'loading';
    });

    // Handle the success state after creating a Medical Record
    builder.addCase(createMedicalRecord.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.medicalRecords.push(action.payload);
    });

    // Handle the error state if creating a Medical Record fails
    builder.addCase(createMedicalRecord.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
  },
});

export default medicalRecordsSlice.reducer;
