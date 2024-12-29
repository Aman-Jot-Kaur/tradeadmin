import React, { useState } from 'react';
import {
  Grid,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/firebase'; // Import the Firestore instance
import { collection, addDoc } from 'firebase/firestore'; // Firestore functions
import Sidebar from '../components/Sidebar';

const AddTradePage = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    date: '',
    price: '',
    status: '',
    symbol: '',
    type: '',
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tradesRef = collection(db, 'trades'); // Reference to the trades collection
    await addDoc(tradesRef, formData); // Use addDoc to add the new trade
    navigate('/trades');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Grid container sx={{ height: '100vh', background: '#f5f5f5' }}>
      {/* Sidebar */}
      <Grid
        item
        xs={12}
        sm={3}
        sx={{
          display: { xs: 'none', sm: 'block' },
          backgroundColor: '#ffffff',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Sidebar />
      </Grid>

      <Grid
        item
        xs={12}
        sm={9}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: { xs: 2, sm: 4 },
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            maxWidth: '600px',
            padding: { xs: 3, sm: 4 },
            borderRadius: '16px',
            backgroundColor: '#ffffff',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              mb: 3,
              fontWeight: 'bold',
              color: '#333333',
            }}
          >
            Add New Trade
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Symbol"
              name="symbol"
              value={formData.symbol}
              onChange={handleInputChange}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              margin="normal"
              variant="outlined"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                mt: 2,
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '16px',
                textTransform: 'none',
              }}
            >
              Submit Trade
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AddTradePage;
