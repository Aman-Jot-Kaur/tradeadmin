import React, { useState } from 'react';
import { Grid, Typography } from '@mui/material';
import {  useNavigate } from 'react-router-dom';
import { db } from '../services/firebase'; 
import { collection, addDoc } from 'firebase/firestore'; 
import Sidebar from '../components/Sidebar';
import SubadminForm from '../components/SubAdminForm/Subadminform';
const AddSubadminPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    assignedUser: '',
  })

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('formData --->', formData);
    const subadminsRef = collection(db, 'subadmins'); 
    await addDoc(subadminsRef, formData); 
    navigate('/subadmin');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <Grid container className='outergrid'>
      <Grid item xs={2}>
        {/* Sidebar */}
        <Sidebar />
      </Grid>
      <Grid item xs={10}>
        <Typography sx={{ textAlign: "center", m: 4 }} variant="h5">Add Subadmin</Typography>
        <SubadminForm
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          formData={formData}
        />
      </Grid>
    </Grid>
  );
};

export default AddSubadminPage;