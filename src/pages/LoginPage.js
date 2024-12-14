import React, { useState } from 'react';
import { Grid, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase'; // Ensure this points to your initialized Firebase auth object

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Firebase v9 authentication function
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      localStorage.setItem('adminEmailSA', formData.email);

      navigate('/trades'); // Navigate to trades page after successful login
    } catch (error) {
      // Friendly error message handling
      if (error.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else {
        setError('Failed to login. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <Grid
      container
      className="outergrid"
      direction="column"
      alignItems="center"
      justifyContent="center"
      spacing={2}
      style={{ minHeight: '100vh', padding: '20px' }}
    >
      <Grid item>
        <Typography variant="h5">Login</Typography>
      </Grid>
      <Grid item>
        <form onSubmit={handleSubmit}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item>
              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item>
              {loading ? (
                <CircularProgress />
              ) : (
                <Button variant="contained" color="primary" type="submit" fullWidth>
                  Login
                </Button>
              )}
            </Grid>
            {error && (
              <Grid item>
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              </Grid>
            )}
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
