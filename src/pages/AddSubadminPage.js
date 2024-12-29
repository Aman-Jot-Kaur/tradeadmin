import React, { useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
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
    role: 'admin',
  });

  const navigate = useNavigate();

  const handleSubmit = async () => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );
    const user = userCredential.user;
    console.log('formData --->', formData, userCredential);
    const subadminsRef = collection(db, 'subadmins');
    await addDoc(subadminsRef, formData);
    navigate('/subadmin');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Grid container sx={{ padding: { xs: 2, sm: 4 }, height: '100vh' }}>
      {/* Sidebar */}
      <Grid item xs={12} sm={3} sx={{ display: { xs: 'none', sm: 'block' } }}>
        <Sidebar />
      </Grid>
      <Grid item xs={12} sm={9}>
        <Typography
          sx={{
            textAlign: 'center',
            m: 4,
            fontSize: { xs: '1.5rem', sm: '2rem' },
            fontWeight: 'bold',
          }}
          variant="h5"
        >
          Add Subadmin
        </Typography>
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
