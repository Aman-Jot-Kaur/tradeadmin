import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { db } from '../services/firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import Sidebar from '../components/Sidebar';

const TradesPage = () => {
  const [trades, setTrades] = useState([]);
  const [filteredTrades, setFilteredTrades] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tradeFilter, setTradeFilter] = useState('all');

  const currentEmail = localStorage.getItem('adminEmailSA');

  useEffect(() => {
    const fetchTrades = async () => {
      console.log(currentEmail,"email now")
      const tradesCollection = collection(db, 'trades');
      const tradesSnapshot = await getDocs(tradesCollection);
      const tradesData = tradesSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((trade) => trade.emails?.includes(currentEmail));

      setTrades(tradesData);
      setFilteredTrades(tradesData);
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

    if (query) {
      filtered = filtered.filter(
        (trade) =>
          trade.email?.toLowerCase().includes(query) ||
          trade.status?.toLowerCase().includes(query) ||
          trade.type?.toLowerCase().includes(query)
      );
    }

    if (filter !== 'all') {
      filtered = filtered.filter((trade) => trade.status === filter);
    }

    setFilteredTrades(filtered);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: '100vh' }}>
      <Grid item xs={12} md={2} sx={{ backgroundColor: '#f9f9f9', padding: { xs: '10px', md: '20px' } }}>
        <Sidebar />
      </Grid>
      <Box sx={{ flex: 1, padding: { xs: '10px', md: '20px' }, backgroundColor: '#fff' }}>
        <Typography
          variant="h5"
          sx={{
            marginBottom: 4,
            fontWeight: 'bold',
            textAlign: { xs: 'center', md: 'left' },
            color: '#333',
          }}
        >
          Trades
        </Typography>

        <Grid container spacing={2} sx={{ marginBottom: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Search by email, currency, or type"
              value={searchQuery}
              onChange={handleSearch}
              sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <InputLabel>Filter by Status</InputLabel>
              <Select value={tradeFilter} onChange={handleFilterChange} label="Filter by Status">
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="Close">Close</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/trades/add"
            sx={{
              padding: '10px 20px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: 2,
              boxShadow: '0px 3px 6px rgba(0,0,0,0.1)',
            }}
          >
            Add Trade
          </Button>
        </Box>

        <Box sx={{ overflowX: 'auto', backgroundColor: '#f5f5f5', borderRadius: 2, padding: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                {['S.No.', 'Email', 'Currency', 'Type', 'Qty', 'Buy', 'Sell', 'Date', 'Status', 'Actions'].map(
                  (heading) => (
                    <TableCell key={heading} sx={{ fontWeight: 'bold', color: '#555' }}>
                      {heading}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTrades.length === 0 ? (
               <TableRow>
               <TableCell colSpan={10}>
                 <Box
                   sx={{
                     display: 'flex',
                     justifyContent: 'center',
                     alignItems: 'center',
                     height: '300px', // Adjust as needed to match your layout
                     fontSize: '1.2rem',
                     fontWeight: 'bold',
                     textAlign: 'center',
                   }}
                 >
                   No trades available yet
                 </Box>
               </TableCell>
             </TableRow>
             
              
              ) : (
                filteredTrades.map((trade, index) => (
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
                      <Link to={`/trades/${trade.id}/edit`} style={{ marginRight: 10 }}>
                        Edit
                      </Link>
                      <Button
                        onClick={() => handleDelete(trade.id)}
                        sx={{
                          color: '#fff',
                          backgroundColor: '#f44336',
                          '&:hover': { backgroundColor: '#d32f2f' },
                          padding: '5px 10px',
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
};

export default TradesPage;
