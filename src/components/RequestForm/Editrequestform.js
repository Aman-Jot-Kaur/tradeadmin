import React, { useState, useEffect } from 'react';
import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { db } from '../../services/firebase';
import { collection, doc, getDoc, addDoc, updateDoc } from 'firebase/firestore';

const RequestForm = () => {
  const params = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(params.id); // Determine if it's edit mode based on params
  const [request, setRequest] = useState({
    userId: '',
    email: '',
    totalAmount: '',
    status: 'pending', // Default value for status
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchRequest = async () => {
        const requestDocRef = doc(db, 'WithdrawRequest', params.id);
        const requestSnapshot = await getDoc(requestDocRef);
        if (requestSnapshot.exists()) {
          setRequest(requestSnapshot.data());
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

    try {
      if (isEditMode) {
        // Update existing request
        const requestRef = doc(db, 'WithdrawRequest', params.id);
        await updateDoc(requestRef, request);
      } else {
        // Add new request
        const requestsCollection = collection(db, 'WithdrawRequest');
        await addDoc(requestsCollection, request);
      }
      navigate('/requests'); // Redirect to the requests page
    } catch (error) {
      console.error('Error saving request:', error);
    }
  };

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
          sx={{
            width: '100%',
            padding: '10px',
            fontSize: '18px',
            borderRadius: '5px',
          }}
        />
        <TextField
          label="Email"
          name="email"
          value={request.email}
          onChange={handleInputChange}
          required
          sx={{
            width: '100%',
            padding: '10px',
            fontSize: '18px',
            borderRadius: '5px',
          }}
        />
        <TextField
          label="Total Amount"
          name="totalAmount"
          value={request.totalAmount}
          onChange={handleInputChange}
          required
          sx={{
            width: '100%',
            padding: '10px',
            fontSize: '18px',
            borderRadius: '5px',
          }}
        />
        <TextField
          label="Status"
          name="status"
          select
          value={request.status}
          onChange={handleInputChange}
          required
          sx={{
            width: '100%',
            padding: '10px',
            fontSize: '18px',
            borderRadius: '5px',
          }}
        >
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="accepted">Accepted</MenuItem>
          <MenuItem value="rejected">Rejected</MenuItem>
        </TextField>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Button
            variant="contained"
            type="submit"
            sx={{
              padding: '10px 20px',
              fontSize: '18px',
              borderRadius: '5px',
            }}
          >
            {isEditMode ? 'Update Request' : 'Add Request'}
          </Button>
          <Button
            component={Link}
            to="/requests"
            sx={{
              padding: '10px 20px',
              fontSize: '18px',
              borderRadius: '5px',
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
