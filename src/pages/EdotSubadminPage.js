import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { db } from '../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
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
    const subadminRef = doc(db, 'subadmins', id);
    await updateDoc(subadminRef, subadmin);
    window.location.href = '/trades';
  };

  const handleInputChange = (e) => {
    setSubadmin({
      ...subadmin,
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
          Edit Subadmin
        </Typography>
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
