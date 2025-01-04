import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { db } from '../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Sidebar from '../components/Sidebar';
import TradeForm from '../components/TradeForm/TradeForm';

const EditTradePage = () => {
  const [trade, setTrade] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchTrade = async () => {
      const tradeRef = doc(db, 'trades', id);
      const tradeDoc = await getDoc(tradeRef);
      setTrade(tradeDoc.data());
    };
    fetchTrade();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const tradeRef = doc(db, 'trades', id);
    await updateDoc(tradeRef, trade);
    window.location.href = '/trades';
  };

  const handleInputChange = (e) => {
    setTrade({
      ...trade,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Grid container direction={{ xs: 'row', md: 'row' }} spacing={2} sx={{ minHeight: '100vh' }}>
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
      <Grid
        item
        xs={12}
        md={9}
        lg={10}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'roq' },
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: { xs: 2, md: 4 },
          backgroundColor: '#ECF0F1',
          borderRadius: 2,
          boxShadow: 3,
          overflowY: 'auto',
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
        {/* Removed <form> wrapping TradeForm */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '800px',
            padding: 4,
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          <TradeForm
            handleInputChange={handleInputChange}
            handleSubmit={handleUpdate} // Pass handleUpdate to TradeForm
            formData={trade}
            isUpdateForm
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default EditTradePage;
