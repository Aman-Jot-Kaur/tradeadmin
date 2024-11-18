import React, { useState } from 'react';
import { Grid, TextField, Button, Typography } from '@mui/material';
import { firebase } from '../services/firebase';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await firebase.auth().signInWithEmailAndPassword(formData.email, formData.password);
      // Handle successful login
    } catch (error) {
      // Handle error
    }
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <Grid container className='outergrid' direction="column" alignItems="center" justifyContent="center" spacing={2}>
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
              />
            </Grid>
            <Grid item>
              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" type="submit">
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

export default LoginPage;