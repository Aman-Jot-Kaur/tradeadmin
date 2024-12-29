import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { db } from '../services/firebase';  
import { doc, getDoc, updateDoc } from 'firebase/firestore'; 
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
    });
  };

  return (
    <Grid container direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ height: '100vh' }}>
      {/* Sidebar */}
      <Grid
        item
        xs={12}
        md={3}
        lg={2}
        sx={{
          backgroundColor: '#f5f5f5',
          padding: 2,
          height: { md: '100%', xs: 'auto' },
        }}
      >
        <Sidebar />
      </Grid>

      {/* Main Content */}
      <Grid
        item
        xs={12}
        md={9}
        lg={10}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: { xs: 2, md: 4 },
        }}
      >
        <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: 4 }}>
          Edit Subadmin Request
        </Typography>
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
