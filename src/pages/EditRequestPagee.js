import React, { useState, useEffect } from 'react';
import { Grid, Typography, TextField, Button } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { db } from '../services/firebase';  
import { doc, getDoc, updateDoc } from "firebase/firestore"; 
import Sidebar from '../components/Sidebar';
import EditRequestPage from '../components/RequestForm/Editrequestform';
const EditSubadminPage = () => {
  const [subadmin, setSubadmin] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchSubadmin = async () => {
      const subadminRef = doc(db, 'WithdrawRequest', id); 
      const subadminDoc = await getDoc(subadminRef); 
      setSubadmin(subadminDoc.data());
    };
    fetchSubadmin();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const subadminRef = doc(db, 'WithdrawRequest', id); 
    await updateDoc(subadminRef, subadmin); 
    window.location.href = '/requests';
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
        <EditRequestPage
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