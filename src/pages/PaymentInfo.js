import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { db } from '../services/firebase'; // Import your Firebase config
import { doc, getDoc, setDoc } from 'firebase/firestore'; 
import Sidebar from '../components/Sidebar';

const AdminPaymentPage = () => {
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upiName, setUpiName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [usdtName, setUsdtName] = useState('');
  const [usdtId, setUsdtId] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [btcName, setBtcName] = useState('');
  const [btcId, setBtcId] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  const paymentDocId = 'paymentDetails'; // Fixed ID for the payment document

  // Fetch the payment details from Firestore
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const paymentRef = doc(db, 'Payment', paymentDocId);
        const paymentSnapshot = await getDoc(paymentRef);

        if (paymentSnapshot.exists()) {
          const paymentData = paymentSnapshot.data();
          setPaymentInfo(paymentData);

          setUpiName(paymentData.upiName || '');
          setUpiId(paymentData.upiId || '');
          setUsdtName(paymentData.usdtName || '');
          setUsdtId(paymentData.usdtId || '');
          setBankName(paymentData.bankName || '');
          setAccountHolder(paymentData.accountHolder || '');
          setAccountNumber(paymentData.accountNumber || '');
          setIfscCode(paymentData.ifscCode || '');
          setBtcName(paymentData.btcName || '');
          setBtcId(paymentData.btcId || '');
        } else {
          console.warn('Payment document not found');
        }
      } catch (error) {
        console.error('Error fetching payment details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, []);

  const handleSave = async () => {
    const updatedPaymentDetails = {
      upiName,
      upiId,
      usdtName,
      usdtId,
      bankName,
      accountHolder,
      accountNumber,
      ifscCode,
      btcName,
      btcId,
    };

    try {
      const paymentRef = doc(db, 'Payment', paymentDocId);
      await setDoc(paymentRef, updatedPaymentDetails, { merge: true }); // Update the document
      setPaymentInfo(updatedPaymentDetails);
      setIsEditMode(false); // Exit edit mode
    } catch (error) {
      console.error('Error updating payment details:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#f9f9f9', mt: 4 }}>
      <Sidebar sx={{ flex: 1, maxWidth: '250px', borderRight: '1px solid #ddd' }} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ flex: 3, padding: '20px', overflowY: 'auto' }}>
          <Typography
            variant="h4"
            sx={{
              marginBottom: 4,
              fontWeight: 'bold',
              color: '#333',
              textTransform: 'uppercase',
            }}
          >
            Payment Details
          </Typography>

          <TextField
            label="UPI Name"
            value={upiName}
            onChange={(e) => setUpiName(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
            disabled={!isEditMode}
          />
          <TextField
            label="UPI ID"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
            disabled={!isEditMode}
          />

          <TextField
            label="USDT Name"
            value={usdtName}
            onChange={(e) => setUsdtName(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
            disabled={!isEditMode}
          />
          <TextField
            label="USDT ID"
            value={usdtId}
            onChange={(e) => setUsdtId(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
            disabled={!isEditMode}
          />

          <TextField
            label="Bank Name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
            disabled={!isEditMode}
          />
          <TextField
            label="Account Holder Name"
            value={accountHolder}
            onChange={(e) => setAccountHolder(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
            disabled={!isEditMode}
          />
          <TextField
            label="Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
            disabled={!isEditMode}
          />
          <TextField
            label="IFSC Code"
            value={ifscCode}
            onChange={(e) => setIfscCode(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
            disabled={!isEditMode}
          />

          <TextField
            label="BTC Name"
            value={btcName}
            onChange={(e) => setBtcName(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
            disabled={!isEditMode}
          />
          <TextField
            label="BTC ID"
            value={btcId}
            onChange={(e) => setBtcId(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
            disabled={!isEditMode}
          />

          {isEditMode ? (
            <Button variant="contained" color="primary" onClick={handleSave} sx={{ marginRight: 2 }}>
              Save
            </Button>
          ) : (
            <Button variant="contained" color="secondary" onClick={() => setIsEditMode(true)} sx={{ marginRight: 2 }}>
              Edit
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AdminPaymentPage;
