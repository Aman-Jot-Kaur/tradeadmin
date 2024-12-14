import React, { useState } from 'react';
import { Grid, Typography, Box } from '@mui/material';
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
    // Add subadmin email to formData
    const tradeData = { ...formData, emails:[subadminEmail,"superadmin@gmail.com"] };
    console.log('✌️formData with subadminEmail --->', tradeData);
    
    const tradesRef = collection(db, 'trades'); // Reference to the trades collection
    await addDoc(tradesRef, tradeData); // Use addDoc to add the new trade with subadminEmail
    navigate('/trades');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Grid container className='outergrid'>
      <Grid item xs={2}>
        {/* Sidebar */}
        <Sidebar />
      </Grid>
      <Grid item xs={10}>
        <Typography sx={{ textAlign: "center", m: 4 }} variant="h5">Add Trade</Typography>
        <TradeForm
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          formData={formData}
        />
      </Grid>
    </Grid>
  );
};

export default AddTradePage;
