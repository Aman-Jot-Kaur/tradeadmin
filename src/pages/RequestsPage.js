import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { db } from '../services/firebase'; // Import the Firestore instance
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore'; // Firestore functions
import Sidebar from '../components/Sidebar';

const RequestsPage = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      const customersRef = collection(db, 'WithdrawRequest');
      const customersSnapshot = await getDocs(customersRef);
      const customersData = customersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort customers by Firestore timestamp in descending order (latest on top)
      customersData.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds); // Sort by timestamp field

      setCustomers(customersData);
    };
    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    const customerRef = doc(db, 'WithdrawRequest', id);
    await deleteDoc(customerRef);
    setCustomers(customers.filter((customer) => customer.id !== id));
  };

  // Filter customers based on the search term
  const filteredCustomers = customers.filter((customer) =>
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid item xs={2} sx={{ padding: '20px' }}>
        {/* Sidebar */}
        <Sidebar />
      </Grid>
      <Box sx={{ width: '100%', padding: '20px' }}>
        <Typography
          variant="h4"
          sx={{
            marginBottom: 4,
            fontWeight: 'bold',
            color: '#333',
            textTransform: 'uppercase',
          }}
        >
          Requests
        </Typography>

        {/* Search Field */}
        <Grid container justifyContent="flex-end" mb={2}>
          <TextField
            label="Search by User ID or Email"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: '300px',
              fontSize: '16px',
              borderRadius: '5px',
            }}
          />
        </Grid>
        <Button 
    variant="contained" 
    color="primary" 
    component={Link} 
    to="/requests/add "
    sx={{ marginBottom: '20px' }}
  >
    Add Request
  </Button>

        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
            <TableRow>
              <TableCell>S.No.</TableCell>
              <TableCell>User id</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Requested type</TableCell>
              <TableCell>Requested Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.map((customer, index) => (
              <TableRow key={customer.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{customer.userId}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.type}</TableCell>
                <TableCell>{customer.requestedAmount}</TableCell>
                <TableCell>{customer.status}</TableCell>
                <TableCell>{customer.totalAmount}</TableCell>
                <TableCell>
                  <Link
                    to={`/requests/${customer.id}`}
                    sx={{
                      fontSize: 16,
                      fontWeight: 'medium',
                      color: '#0063cc',
                      textTransform: 'capitalize',
                      marginRight: 2,
                    }}
                  >
                    Edit
                  </Link>
                  <Button
                    onClick={() => handleDelete(customer.id)}
                    sx={{
                      fontSize: 16,
                      fontWeight: 'medium',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      color: 'red',
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default RequestsPage;
