import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
} from '../helpers/localStorage';

const initialState = {
  token: getLocalStorage('token') || null,
  user: getLocalStorage('user') || null,
  tempUser: {
    name: '',
    surname: '',
    date_of_birth: '',
    national_id_number: '',
    team: '',
    phone_number: '',
    team_role: '',
    email: '',
    password: '',
    user: '',
  },
  isLoading: false,
  errors: null,
  formAuth: 'login',
};

export const logInUser = createAsyncThunk(
  'auth/login',
  async (userInput, thunkAPI) => {
    try {
      const response = await axios.post(
        'http://localhost:3001/auth/login',
        userInput
      );
      const responseData = response.data;

      const { token } = responseData;

      const { user } = responseData;

      const { error } = responseData;

      return { token, user, error };
    } catch (error) {
      return thunkAPI.rejectWithValue('Invalid name or password!');
    }
  }
);

export const logOutUser = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      const response = await axios.delete('http://localhost:3001/auth/logout', {
        headers: {
          authorization: thunkAPI.getState().auth.token,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue('something went wrong!');
    }
  }
);
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userInput, thunkAPI) => {
    try {
      const response = await axios.post(
        'http://localhost:3001/users',
        userInput
      );

      return response.data;
    } catch (error) {
      if (error.response.status === 422) {
        return thunkAPI.rejectWithValue('username must be unique');
      }
      return thunkAPI.rejectWithValue('something went wrong!');
    }
  }
);

const authSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    handleUpdate: (state, { payload: { name, value } }) => {
      const tempUser = { ...state.tempUser, [name]: value };
      return { ...state, tempUser };
    },
    toggleFormAuth: (state) => ({
      ...state,
      formAuth: state.formAuth === 'login' ? 'register' : 'login',
    }),
    toRegister: (state) => ({
      ...state,
      formAuth: 'register',
    }),
    toLogin: (state) => ({
      ...state,
      formAuth: 'login',
    }),
    clearErrors: (state) => ({
      ...state,
      errors: null,
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(logInUser.pending, (state) => ({
        ...state,
        isLoading: true,
        errors: null,
      }))
      .addCase(logInUser.fulfilled, (state, { payload }) => {
        const { token, user, error } = payload;

        if (token && user) {
          setLocalStorage('token', token);
          setLocalStorage('user', user);
        }

        return {
          ...state,
          token,
          user,
          isLoading: false,
          tempUser: {
            email: '',
            password: '',
          },
          errors: error,
        };
      })
      .addCase(logInUser.rejected, (state, { payload }) => ({
        ...state,
        isLoading: false,
        errors: payload,
      }));
    builder
      .addCase(logOutUser.pending, (state) => ({
        ...state,
        isLoading: true,
      }))
      .addCase(logOutUser.fulfilled, (state) => {
        removeLocalStorage('token');
        removeLocalStorage('user');
        return {
          ...state,
          isLoading: false,
          token: null,
          user: null,
        };
      })
      .addCase(logOutUser.rejected, (state) => {
        removeLocalStorage('token');
        removeLocalStorage('user');
        return {
          ...state,
          isLoading: false,
          token: null,
          user: null,
        };
      });
    builder
      .addCase(registerUser.pending, (state) => ({
        ...state,
        isLoading: true,
      }))
      .addCase(registerUser.fulfilled, (state) => ({
        ...state,
        isLoading: false,
        tempUser: {
          name: '',
          surname: '',
          date_of_birth: '',
          national_id_number: '',
          team: '',
          phone_number: '',
          team_role: '',
          email: '',
          password: '',
        },
      }))
      .addCase(registerUser.rejected, (state, { payload }) => ({
        ...state,
        isLoading: false,
        errors: payload,
      }));
  },
});
export const {
  handleUpdate,
  toggleFormAuth,
  toRegister,
  toLogin,
  clearErrors,
} = authSlice.actions;
export default authSlice.reducer;
