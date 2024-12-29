import React, { useState, useEffect } from 'react';
import { Box, Button, MenuItem, TextField, Typography, CircularProgress } from '@mui/material';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { db } from '../../services/firebase';
import { collection, doc, getDoc, addDoc, updateDoc } from 'firebase/firestore';

const RequestForm = () => {
  const params = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(params.id);
  const [request, setRequest] = useState({
    userId: '',
    email: '',
    totalAmount: '',
    amount: '',
    status: 'pending',
    type: '',
    method: '',  // Added method field
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const fetchRequest = async () => {
        setLoading(true);
        try {
          const requestDocRef = doc(db, 'WithdrawRequest', params.id);
          const requestSnapshot = await getDoc(requestDocRef);
          if (requestSnapshot.exists()) {
            setRequest(requestSnapshot.data());
          } else {
            setError('Request not found.');
          }
        } catch (err) {
          setError('Failed to fetch request data.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchRequest();
    }
  }, [isEditMode, params.id]);

  const handleInputChange = (e) => {
    setRequest({ ...request, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditMode) {
        const requestRef = doc(db, 'WithdrawRequest', params.id);
        await updateDoc(requestRef, request);
      } else {
        const requestsCollection = collection(db, 'WithdrawRequest');
        await addDoc(requestsCollection, request);
      }

      // Fetch wallet details based on userId
      const walletRef = doc(db, 'wallet', request.userId);
      const walletSnapshot = await getDoc(walletRef);

      if (walletSnapshot.exists()) {
        const walletData = walletSnapshot.data();

        let updatedBalances = [...walletData.balances]; // Clone the balances array
        const amount = parseFloat(request.amount);

        // Update wallet balance based on request type (deposit or withdrawal)
        if (request.status === 'accepted') {
          if (request.type === 'deposit') {
            updatedBalances = updatedBalances.map((balance) => {
              if (balance.label === 'Deposit Balance' || balance.label==='Available balance') {
                balance.amount += amount;  // Add amount to Deposit Balance
              }
              return balance;
            });
          } else if (request.type === 'withdrawal') {
            updatedBalances = updatedBalances.map((balance) => {
              if ( balance.label==='Available balance') {
                balance.amount -= amount;  // Deduct amount from Withdrawal Balance
              }
              if (balance.label === 'Withdrawal Balance') {
                balance.amount += amount;  // Add amount to Deposit Balance
              }
              return balance;
            });
          }
        }

        // Update the wallet document with new balances
        await updateDoc(walletRef, {
          balances: updatedBalances,
        });
      }

      navigate('/requests');
    } catch (err) {
      setError('Failed to save request.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '600px',
        margin: 'auto',
        alignItems: 'center',
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: '#f9f9f9',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          marginBottom: 4,
          fontWeight: 'bold',
          color: '#333',
          textTransform: 'uppercase',
        }}
      >
        {isEditMode ? 'Edit Request' : 'Add Request'}
      </Typography>
      {error && (
        <Typography
          sx={{
            color: 'red',
            marginBottom: 2,
          }}
        >
          {error}
        </Typography>
      )}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          width: '100%',
        }}
      >
        <TextField
          label="User ID"
          name="userId"
          value={request.userId}
          onChange={handleInputChange}
          required
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          value={request.email}
          onChange={handleInputChange}
          required
          type="email"
          fullWidth
        />
        <TextField
          label="Total Amount"
          name="totalAmount"
          value={request.totalAmount}
          onChange={handleInputChange}
          
          type="number"
          fullWidth
        />
        <TextField
          label="Method"  // Added Method field
          name="method"
          value={request.method}
          onChange={handleInputChange}
          select
          required
          fullWidth
        >
          <MenuItem value="bankTransfer">Bank Transfer</MenuItem>
          <MenuItem value="upi">UPI</MenuItem>
          <MenuItem value="crypto">Cryptocurrency</MenuItem>
          <MenuItem value="paypal">PayPal</MenuItem>
        </TextField>
        <TextField
          label="Type"
          name="type"
          value={request.type}
          onChange={handleInputChange}
          select
          required
          fullWidth
        >
          <MenuItem value="deposit">Deposit</MenuItem>
          <MenuItem value="withdrawal">Withdrawal</MenuItem>
        </TextField>
        <TextField
          label="Status"
          name="status"
          value={request.status}
          onChange={handleInputChange}
          select
          required
          fullWidth
        >
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="accepted">Accepted</MenuItem>
          <MenuItem value="rejected">Rejected</MenuItem>
        </TextField>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Button variant="contained" type="submit" sx={{ padding: '10px 20px' }}>
            {isEditMode ? 'Update Request' : 'Add Request'}
          </Button>
          <Button
            component={Link}
            to="/requests"
            sx={{
              padding: '10px 20px',
              backgroundColor: '#ccc',
              color: '#333',
              '&:hover': { backgroundColor: '#ddd' },
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default RequestForm;
