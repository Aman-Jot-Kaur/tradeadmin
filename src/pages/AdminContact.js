import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { db } from '../services/firebase'; // Import your Firebase config
import { doc, getDoc, setDoc } from 'firebase/firestore'; 
import Sidebar from '../components/Sidebar';

const AdminContactPage = () => {
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminNumber, setAdminNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [telegramId, setTelegramId] = useState('');
  const [instagramId, setInstagramId] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  const contactDocId = 'newContact'; // Fixed ID for the contact document

  // Fetch the contact info from Firestore
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const contactRef = doc(db, 'Contact', contactDocId);
        const contactSnapshot = await getDoc(contactRef);

        if (contactSnapshot.exists()) {
          const contactData = contactSnapshot.data();
          setContactInfo(contactData);
          setAdminNumber(contactData.adminNumber || '');
          setWhatsappNumber(contactData.whatsappNumber || '');
          setTelegramId(contactData.telegramId || '');
          setInstagramId(contactData.instagramId || '');
        } else {
          console.warn('Contact document not found');
        }
      } catch (error) {
        console.error('Error fetching contact info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const handleSave = async () => {
    const updatedContact = {
      adminNumber,
      whatsappNumber,
      telegramId,
      instagramId,
    };

    try {
      const contactRef = doc(db, 'Contact', contactDocId);
      await setDoc(contactRef, updatedContact, { merge: true }); // Update the document
      setContactInfo(updatedContact);
      setIsEditMode(false); // Exit edit mode
    } catch (error) {
      console.error('Error updating contact info:', error);
    }
  };

  // if (loading) {
  //   return (
  //     <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#f9f9f9', mt: 4 }}>
      <Sidebar sx={{ flex: 1, maxWidth: '250px', borderRight: '1px solid #ddd' }} />
{loading ?  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box> : 
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
          Contact Info
        </Typography>

        <TextField
          label="Admin Number"
          value={adminNumber}
          onChange={(e) => setAdminNumber(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2 }}
          disabled={!isEditMode}
        />

        <TextField
          label="WhatsApp Number"
          value={whatsappNumber}
          onChange={(e) => setWhatsappNumber(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2 }}
          disabled={!isEditMode}
        />

        <TextField
          label="Telegram ID"
          value={telegramId}
          onChange={(e) => setTelegramId(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2 }}
          disabled={!isEditMode}
        />

        <TextField
          label="Instagram ID"
          value={instagramId}
          onChange={(e) => setInstagramId(e.target.value)}
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
      </Box>}
    </Box>
  );
};

export default AdminContactPage;
