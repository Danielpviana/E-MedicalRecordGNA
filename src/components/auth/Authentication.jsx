import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  handleUpdate,
  logInUser,
  registerUser,
  toggleFormAuth,
  clearErrors,
} from '../../redux/authenticationSlice';
import classes from './Authentication.module.css';

const Authentication = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    token,
    errors,
    tempUser: {
      name,
      username,
      email: initialEmail,
      password,
      confirmPassword: initialConfirmPassword,
    },
  } = useSelector((state) => state.auth);

  const formAuth = useSelector((state) => state.auth.formAuth);

  const [email, setEmail] = useState(initialEmail || '');
  const [confirmPassword, setConfirmPassword] = useState(
    initialConfirmPassword || ''
  );

  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch, formAuth]);

  const handleLogIn = (e) => {
    e.preventDefault();

    dispatch(logInUser({ email, password }));
  };

  const handleRegister = () => {
    dispatch(
      registerUser({
        user: { name, username, email, password },
      })
    );

    dispatch(toggleFormAuth());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'email') {
      setEmail(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      dispatch(handleUpdate({ name, value }));
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formAuth === 'login') {
      handleLogIn(e);
    } else {
      handleRegister(e);
    }
  };

  return (
    <div className={classes.authFormsContainter}>
      <form onSubmit={(e) => handleSubmit(e)}>
        <h3 className="auth-title">
          {formAuth === 'login' ? 'Log In' : 'Register'}
        </h3>
        {errors && <p className={classes.authErrorMessage}>{errors}</p>}

        {formAuth === 'register' && (
          <>
            <input
              type="text"
              placeholder="name"
              id="name"
              name="name"
              value={name}
              onChange={(e) => handleChange(e)}
              className={classes.authFormInput}
              required
            />
            <input
              type="text"
              placeholder="username"
              id="username"
              name="username"
              value={username || ''}
              onChange={(e) => handleChange(e)}
              className={classes.authFormInput}
              required
            />
          </>
        )}

        <input
          type="text"
          placeholder="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => handleChange(e)}
          className={classes.authFormInput}
          required
        />

        <input
          type="password"
          placeholder="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => handleChange(e)}
          className={classes.authFormInput}
          required
        />

        {formAuth === 'register' && (
          <input
            type="password"
            placeholder="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => handleChange(e)}
            className={classes.authFormInput}
            required
          />
        )}
        <div className={classes.authButtonsContainer}>
          <button type="submit" className={classes.registerBtn}>
            {formAuth === 'login' ? 'Log In' : 'Register'}
          </button>
          {formAuth === 'login' ? (
            <>
              <p className={classes.promptMessage}>
                Don&apos;t have an account?
              </p>
              <button
                type="button"
                className={classes.navigateBtn}
                onClick={() => dispatch(toggleFormAuth())}
              >
                Register
              </button>
            </>
          ) : (
            <>
              <p className={classes.promptMessage}>Already have an account?</p>
              <button
                type="button"
                className={classes.navigateBtn}
                onClick={() => dispatch(toggleFormAuth())}
              >
                Log In
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default Authentication;
