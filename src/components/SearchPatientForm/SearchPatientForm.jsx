import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchPatient, clearSearchResult } from '../../redux/patientsSlice';
import classes from './SearchPatientForm.module.css';

const SearchPatientForm = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [validSearchItemMessage, setValidSearchItemMessage] = useState('');
  const error = useSelector((state) => state.pat.error);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    dispatch(clearSearchResult());
    setValidSearchItemMessage('');
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim().length === 12) {
      dispatch(searchPatient(searchTerm.toUpperCase()));
      setSearchTerm('');
    } else {
      setValidSearchItemMessage('Please enter a valid ID Number.');
    }
  };

  let uiMessage;
  if (error) {
    uiMessage = error;
  }

  return (
    <div>
      <form className={classes.search_form} onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search Patient By ID e.g 22-778899A00"
          className={classes.search_input}
        />
        <button type="submit" className={classes.search_btn}>
          Search
        </button>
      </form>
      <div className={classes.error_message_container}>
        <p className={classes.ui_message}>{uiMessage}</p>
        <p className={classes.ui_message}>{validSearchItemMessage}</p>
      </div>
    </div>
  );
};

export default SearchPatientForm;
