import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, Box, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Link } from 'react-router-dom';
import { db } from '../services/firebase';
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore"; // Firestore functions
import Sidebar from '../components/Sidebar';

const TradesPage = () => {
  const [trades, setTrades] = useState([]);
  const [filteredTrades, setFilteredTrades] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tradeFilter, setTradeFilter] = useState('all'); // For filtering open/close trades

  const currentEmail = localStorage.getItem('adminEmailSA'); // Get current admin email

  useEffect(() => {
    const fetchTrades = async () => {
      const tradesCollection = collection(db, 'trades');
      const tradesSnapshot = await getDocs(tradesCollection);
      const tradesData = tradesSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((trade) => trade.emails?.includes(currentEmail)); // Filter trades by emails array

      setTrades(tradesData);
      setFilteredTrades(tradesData); // Initialize filtered trades
    };
    fetchTrades();
  }, [currentEmail]);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'trades', id));
    setTrades(trades.filter((trade) => trade.id !== id));
    setFilteredTrades(filteredTrades.filter((trade) => trade.id !== id));
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    filterTrades(query, tradeFilter);
  };

  const handleFilterChange = (event) => {
    const filter = event.target.value;
    setTradeFilter(filter);
    filterTrades(searchQuery, filter);
  };

  const filterTrades = (query, filter) => {
    let filtered = trades;

    // Apply search query filter
    if (query) {
      filtered = filtered.filter(
        (trade) =>
          trade.email?.toLowerCase().includes(query) ||
          trade.status?.toLowerCase().includes(query) ||
          trade.type?.toLowerCase().includes(query)
      );
    }

    // Apply open/close filter
    if (filter !== 'all') {
      filtered = filtered.filter((trade) => trade.status === filter); // Assuming trades have a `status` field
    }

    setFilteredTrades(filtered);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid item xs={2} sx={{ padding: '20px' }}>
        {/* Sidebar */}
        <Sidebar />
      </Grid>
      <Box sx={{ width: '100%', padding: '20px' }}>
        <Typography variant="h5" sx={{ marginBottom: 4, fontWeight: 'bold' }}>
          Trades
        </Typography>

        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item xs={6}>
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Search by email, currency, or type"
              value={searchQuery}
              onChange={handleSearch}
            />
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={tradeFilter}
                onChange={handleFilterChange}
                label="Filter by Status"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="Close">Close</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Add Trade Button */}
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/trades/add"
          sx={{ marginBottom: '20px' }}
        >
          Add Trade
        </Button>
        {filteredTrades.length === 0 ? (
                <h1 style={{textAlign:"center",width:"50vw"}}>no trades available yet</h1>
            ) :
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.No.</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Buy</TableCell>
              <TableCell>Sell</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            
            {filteredTrades.map((trade, index) => (
              <TableRow key={trade.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{trade.email}</TableCell>
                <TableCell>{trade.currency}</TableCell>
                <TableCell>{trade.type}</TableCell>
                <TableCell>{trade.quantity}</TableCell>
                <TableCell>{trade.buy}</TableCell>
                <TableCell>{trade.sell}</TableCell>
                <TableCell>{trade.date}</TableCell>
                <TableCell>{trade.status}</TableCell>
                <TableCell>
                  <Link to={`/trades/${trade.id}/edit`}>Edit</Link>
                  <Button onClick={() => handleDelete(trade.id)} sx={{ marginLeft: 2 }}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>}
      </Box>
    </Box>
  );
};

export default TradesPage;
