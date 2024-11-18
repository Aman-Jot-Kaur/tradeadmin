import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const TradeForm = (props) => {
  const { formData, handleInputChange, handleSubmit, isUpdateForm = false } = props;

  return (
    <Box
      onSubmit={handleSubmit}
      component={'form'}
      sx={{ width: '400px', margin: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}
    >
      <TextField
        label="Email"
        name="email"
        required
        size="small"
        fullWidth
        value={formData.email ?? ''}
        onChange={handleInputChange}
      />

      <TextField
        label="Currency"
        name="currency"
        required
        size="small"
        fullWidth
        value={formData.currency ?? ''}
        onChange={handleInputChange}
      />

      <TextField
        label="Type"
        name="type"
        required
        size="small"
        fullWidth
        value={formData.type ?? ''}
        onChange={handleInputChange}
      />

      <TextField
        label="Quantity"
        value={formData.quantity ?? ''}
        name="quantity"
        size="small"
        fullWidth
        required
        onChange={handleInputChange}
      />

      <TextField
        label="Buy"
        value={formData.buy ?? ''}
        name="buy"
        size="small"
        fullWidth
        required
        onChange={handleInputChange}
      />

      <TextField
        label="Sell"
        value={formData.sell ?? ''}
        name="sell"
        size="small"
        fullWidth
        required
        onChange={handleInputChange}
      />

      <TextField
        label="Trade Date"
        value={formData.date ?? ''}
        name="date"
        size="small"
        fullWidth
        required
        onChange={handleInputChange}
      />

      {/* Status Dropdown */}
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

      <Box sx={{ marginTop: '20px', display: 'flex', justifyContent: 'end', alignItems: 'center', gap: '10px' }}>
        <Button>
          <Link style={{ textDecoration: 'none' }} to="/trades">
            Cancel
          </Link>
        </Button>
        {isUpdateForm ? (
          <Button variant="contained" type="submit">
            Update Trade
          </Button>
        ) : (
          <Button variant="contained" type="submit">
            Add Trade
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default TradeForm;
