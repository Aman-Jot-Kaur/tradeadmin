import React, { useState } from 'react';
import { Grid, TextField, Button, Typography } from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase'; // Adjust path as needed

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Save user information to localStorage
      localStorage.setItem('user', JSON.stringify({ email: user.email, uid: user.uid }));

      setSuccess('Account created successfully!');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const navigateToLogin = () => {
    console.log("navigated");
    navigate('/login');
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
        <Typography variant="h5">Signup</Typography>
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
                helperText="Password must be at least 6 characters"
              />
            </Grid>
            {error && (
              <Grid item>
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              </Grid>
            )}
            {success && (
              <Grid item>
                <Typography variant="body2" color="success">
                  {success}
                </Typography>
              </Grid>
            )}
            <Grid item>
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Signup
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
      <Grid item>
        <Button variant="outlined" color="secondary" onClick={navigateToLogin}>
          Go to Login
        </Button>
      </Grid>
    </Grid>
  );
};

export default SignupPage;
