import React, { useState, useEffect } from 'react';
import { Grid, Typography, TextField, Button } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { db } from '../services/firebase';  // Import `db` instead of `firebase`
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Firestore functions
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
        <Typography variant="h5">Edit Trade</Typography>
        <TradeForm
          handleInputChange={handleInputChange}
          handleSubmit={handleUpdate}
          formData={trade}
          isUpdateForm
        />
      </Grid>
    </Grid>
  );
};

export default EditTradePage;
