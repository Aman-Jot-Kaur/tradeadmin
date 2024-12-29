import React, { useState } from 'react';
import { Grid, Typography, Box, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/firebase'; // Import the Firestore instance
import { collection, addDoc } from 'firebase/firestore'; // Firestore functions
import Sidebar from '../components/Sidebar';
import TradeForm from '../components/TradeForm/TradeForm';

const AddTradePage = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    date: '',
    price: '',
    status: '',
    symbol: '',
    type: '',
  });

  const subadminEmail = localStorage.getItem('adminEmailSA'); // Get subadmin email from localStorage
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tradeData = { ...formData, emails: [subadminEmail, 'superadmin@gmail.com'] };
    console.log('✌️formData with subadminEmail --->', tradeData);

    const tradesRef = collection(db, 'trades'); // Reference to the trades collection
    await addDoc(tradesRef, tradeData); // Use addDoc to add the new trade with subadminEmail
    navigate('/trades');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Grid container sx={{ height: '100vh' }}>
      {/* Sidebar */}
      <Grid
        item
        xs={12}
        md={3}
        lg={2}
        sx={{
          backgroundColor: '#f5f5f5',
          padding: 2,
          boxShadow: { md: '2px 0 5px rgba(0, 0, 0, 0.1)' },
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
          justifyContent: 'center',
          alignItems: 'center',
          padding: { xs: 3, md: 5 }, // Added padding for spacing
          backgroundColor: '#f9fafb',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            maxWidth: 600,
            padding: 4,
            borderRadius: 2,
            backgroundColor: 'white',
            marginTop: { xs: 2, md: 4 }, // Added margin for spacing from the top
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{ textAlign: 'center', marginBottom: 3, fontWeight: 'bold' }}
          >
            Add Trade
          </Typography>
          <TradeForm
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            formData={formData}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 4, // Added space above buttons
            }}
          >
            <Button
              variant="contained"
              color="primary"
              sx={{
                flex: 1,
                marginRight: 1,
                textTransform: 'none',
                fontWeight: 'bold',
                padding: 1.5, // Added padding for larger buttons
              }}
              onClick={handleSubmit}
            >
              Save Trade
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              sx={{
                flex: 1,
                marginLeft: 1,
                textTransform: 'none',
                fontWeight: 'bold',
                padding: 1.5, // Added padding for larger buttons
              }}
              onClick={() => navigate('/trades')}
            >
              Cancel
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AddTradePage;
