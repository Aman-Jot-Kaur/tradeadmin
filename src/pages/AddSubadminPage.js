import React, { useState } from 'react';
import { Grid, Typography } from '@mui/material';
import {  useNavigate } from 'react-router-dom';
import { db } from '../services/firebase'; 
import { collection, addDoc } from 'firebase/firestore'; 
import Sidebar from '../components/Sidebar';
import SubadminForm from '../components/SubAdminForm/Subadminform';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
const AddSubadminPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    assignedUser: '',
    role:'admin'
  })

  const navigate = useNavigate();

  const handleSubmit = async () => {
    
    const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
    const user = userCredential.user;
    console.log('formData --->', formData,userCredential);
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