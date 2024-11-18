import React, { useState } from 'react';
import { Grid, Typography, TextField, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
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
  })

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('✌️formData --->', formData);
    const tradesRef = collection(db, 'trades'); // Reference to the trades collection
    await addDoc(tradesRef, formData); // Use addDoc to add the new trade
    navigate('/trades');
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
