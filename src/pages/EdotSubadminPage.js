import React, { useState, useEffect } from 'react';
import { Grid, Typography, TextField, Button } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { db } from '../services/firebase';  
import { doc, getDoc, updateDoc } from "firebase/firestore"; 
import Sidebar from '../components/Sidebar';
import SubadminForm from '../components/SubAdminForm/Subadminform';
const EditSubadminPage = () => {
  const [subadmin, setSubadmin] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchSubadmin = async () => {
      const subadminRef = doc(db, 'subadmins', id); 
      const subadminDoc = await getDoc(subadminRef); 
      setSubadmin(subadminDoc.data());
    };
    fetchSubadmin();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const subadminRef = doc(db, 'subadmins', id); 
    await updateDoc(subadminRef, subadmin); 
    window.location.href = '/subadmin';
  };

  const handleInputChange = (e) => {
    setSubadmin({
      ...subadmin,
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
        <Typography variant="h5">Edit Subadmin</Typography>
        <SubadminForm
          handleInputChange={handleInputChange}
          handleSubmit={handleUpdate}
          formData={subadmin}
          isUpdateForm
        />
      </Grid>
    </Grid>
  );
};

export default EditSubadminPage;