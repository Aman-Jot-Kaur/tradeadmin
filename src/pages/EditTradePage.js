import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { db } from '../services/firebase'; // Import `db` instead of `firebase`
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Firestore functions
import Sidebar from '../components/Sidebar';
import TradeForm from '../components/TradeForm/TradeForm';

const EditTradePage = () => {
  const [trade, setTrade] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchTrade = async () => {
      const tradeRef = doc(db, 'trades', id); // Reference to the specific document
      const tradeDoc = await getDoc(tradeRef); // Use getDoc to retrieve the document
      setTrade(tradeDoc.data());
    };
    fetchTrade();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const tradeRef = doc(db, 'trades', id); // Reference to the specific document
    await updateDoc(tradeRef, trade); // Use updateDoc to update the document
    window.location.href = '/trades';
  };

  const handleInputChange = (e) => {
    setTrade({
      ...trade,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Grid container direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ minHeight: '100vh' }}>
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
          boxShadow: 2,
          borderRadius: 1,
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
          justifyContent: 'flex-start',
          padding: { xs: 2, md: 4 },
          backgroundColor: '#ECF0F1',
          borderRadius: 2,
          boxShadow: 3,
          overflowY: 'auto', // Ensures scrolling only for the content area
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: 'center',
            marginBottom: 3,
            color: '#34495E',
            fontWeight: 600,
          }}
        >
          Edit Trade
        </Typography>
        <Box
          component="form"
          sx={{
            width: '100%',
            maxWidth: '800px',
            padding: 4,
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 2,
            overflow: 'auto',  // Allow content to scroll if necessary
          }}
          onSubmit={handleUpdate}
        >
          <TradeForm
            handleInputChange={handleInputChange}
            handleSubmit={handleUpdate}
            formData={trade}
            isUpdateForm
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
            <Button
              variant="contained"
              type="submit"
              color="primary"
              sx={{
                padding: '12px 24px',
                borderRadius: '8px',
                boxShadow: 2,
                '&:hover': {
                  backgroundColor: '#1D3557',
                  boxShadow: 6,
                },
              }}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default EditTradePage;
