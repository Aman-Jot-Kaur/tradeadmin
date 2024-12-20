import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, FieldValue } from 'firebase/firestore';
import { db } from '../services/firebase'; // Firebase Firestore instance
import { Box, TextField, Button } from '@mui/material';

const NewsFormPage = () => {
  const { id } = useParams(); // Get the news ID from the route (if editing)
  const navigate = useNavigate();
  const isEdit = !!id; // Determine if it's an edit or add page

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      // Fetch existing news data if editing
      const fetchNews = async () => {
        setLoading(true);
        try {
          const docRef = doc(db, 'news', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setFormData(docSnap.data());
          } else {
            console.error('No such document!');
          }
        } catch (error) {
          console.error('Error fetching news:', error);
        }
        setLoading(false);
      };
      fetchNews();
    }
  }, [isEdit, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        timestamp: FieldValue.serverTimestamp(), // Add Firebase server timestamp
      };

      if (isEdit) {
        const docRef = doc(db, 'news', id);
        await updateDoc(docRef, payload); // Update document with new timestamp
      } else {
        // Add a new document with auto-generated ID and timestamp
        await addDoc(collection(db, 'news'), payload);
      }

      navigate('/news'); // Redirect to news listing page
    } catch (error) {
      console.error('Error saving news:', error);
    }

    setLoading(false);
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>{isEdit ? 'Edit News' : 'Add News'}</h2>

      {loading && <p>Loading...</p>}

      <form onSubmit={handleSubmit}>
        <TextField
          name="title"
          label="Title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
          required
          sx={{ marginBottom: '20px' }}
        />

        <TextField
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          required
          multiline
          rows={4}
          sx={{ marginBottom: '20px' }}
        />

        <TextField
          name="imageUrl"
          label="Image URL"
          value={formData.imageUrl}
          onChange={handleChange}
          fullWidth
          required
          sx={{ marginBottom: '20px' }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
        >
          {isEdit ? 'Update News' : 'Add News'}
        </Button>
      </form>
    </Box>
  );
};

export default NewsFormPage;
