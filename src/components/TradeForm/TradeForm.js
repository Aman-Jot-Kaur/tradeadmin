import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl, Grid, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const TradeForm = (props) => {
  const { formData, handleInputChange, handleSubmit, isUpdateForm = false } = props;

  return (
    <Box
      onSubmit={handleSubmit}
      component="form"
      sx={{
        maxWidth: '600px',
        margin: 'auto',
        padding: { xs: '20px', sm: '40px' },
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: '20px', textAlign: 'center', fontWeight: 'bold' }}>
        {isUpdateForm ? 'Update Trade' : 'Add New Trade'}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Email"
            name="email"
            required
            size="small"
            fullWidth
            value={formData.email ?? ''}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Currency"
            name="currency"
            required
            size="small"
            fullWidth
            value={formData.currency ?? ''}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Type"
            name="type"
            required
            size="small"
            fullWidth
            value={formData.type ?? ''}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Quantity"
            value={formData.quantity ?? ''}
            name="quantity"
            size="small"
            fullWidth
            required
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Buy"
            value={formData.buy ?? ''}
            name="buy"
            size="small"
            fullWidth
            required
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Sell"
            value={formData.sell ?? ''}
            name="sell"
            size="small"
            fullWidth
            required
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Trade Date"
            value={formData.date ?? ''}
            name="date"
            size="small"
            fullWidth
            required
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              name="status"
              value={formData.status ?? ''}
              onChange={handleInputChange}
              required
            >
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="Close">Close</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box
        sx={{
          marginTop: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Button
          component={Link}
          to="/trades"
          variant="outlined"
          sx={{
            textDecoration: 'none',
            color: 'primary.main',
            borderColor: 'primary.main',
            '&:hover': { backgroundColor: 'primary.light', borderColor: 'primary.main' },
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: 'primary.main',
            '&:hover': { backgroundColor: 'primary.dark' },
          }}
        >
          {isUpdateForm ? 'Update Trade' : 'Add Trade'}
        </Button>
      </Box>
    </Box>
  );
};

export default TradeForm;
