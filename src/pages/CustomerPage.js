import React, { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  TableContainer,
  Paper,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { db } from '../services/firebase';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import Sidebar from '../components/Sidebar';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const currentEmail = localStorage.getItem('adminEmailSA');

  useEffect(() => {
    const fetchCustomers = async () => {
      const customersRef = collection(db, 'users');
      const customersSnapshot = await getDocs(customersRef);
      const customersData = customersSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((customer) => customer.subadmins?.includes(currentEmail));

      setCustomers(customersData);
      setFilteredCustomers(customersData);
    };
    fetchCustomers();
  }, [currentEmail]);

  const handleDelete = async (id) => {
    const customerRef = doc(db, 'users', id);
    await deleteDoc(customerRef);
    setCustomers(customers.filter((customer) => customer.id !== id));
    setFilteredCustomers(filteredCustomers.filter((customer) => customer.id !== id));
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    if (query) {
      const filtered = customers.filter(
        (customer) =>
          customer.name?.toLowerCase().includes(query) ||
          customer.email?.toLowerCase().includes(query) ||
          customer.status?.toLowerCase().includes(query)
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      <Grid item xs={12} md={2} sx={{ padding: '20px' }}>
        <Sidebar />
      </Grid>
      <Box sx={{ width: '100%', padding: '20px', overflowX: 'auto' }}>
        <Typography
          variant="h4"
          sx={{
            marginBottom: 4,
            fontWeight: 'bold',
            color: '#333',
            textTransform: 'uppercase',
          }}
        >
          Customers
        </Typography>
        <Grid container justifyContent="space-between" alignItems="center" mb={2}>
          <TextField
            variant="outlined"
            placeholder="Search by name, email, or status"
            value={searchQuery}
            onChange={handleSearch}
            sx={{ width: { xs: '100%', md: '50%' }, marginBottom: 2 }}
          />
        </Grid>
        {filteredCustomers.length === 0 ? (
          <Typography
            sx={{
              textAlign: 'center',
              width: '100%',
              fontSize: '18px',
              color: '#555',
            }}
          >
            No data available yet
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
                <TableRow>
                  <TableCell>S.No.</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Password</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Document Front</TableCell>
                  <TableCell>Document Back</TableCell> {/* New Column for Image */}
                  <TableCell>Change Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCustomers.map((customer, index) => (
                  <TableRow key={customer.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.password}</TableCell>
                    <TableCell>{customer.status}</TableCell>
                    <TableCell>
                      {/* Render image from Base64 */}
                      {customer.documentFront ? (
                        <img
                          src={`data:image/jpeg;base64,${customer.documentFront}`}
                          alt="Customer"
                          style={{ width: 250, height: 250, objectFit: 'cover' }}
                        />
                      ) : (
                        <Typography>No Image</Typography>
                      )}</TableCell>
                      <TableCell>
                       {customer.documentBack ? (
                        <img
                          src={`data:image/jpeg;base64,${customer.documentBack}`}
                          alt="Customer"
                          style={{ width: 250, height: 250, objectFit: 'cover' }}
                        />
                      ) : (
                        <Typography>No Image</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {customer.status === 'active' ? (
                        <Button
                          onClick={async () => {
                            const customerRef = doc(db, 'users', customer.id);
                            await updateDoc(customerRef, { status: 'inactive' });
                            setCustomers(
                              customers.map((c) =>
                                c.id === customer.id ? { ...c, status: 'inactive' } : c
                              )
                            );
                            setFilteredCustomers(
                              filteredCustomers.map((c) =>
                                c.id === customer.id ? { ...c, status: 'inactive' } : c
                              )
                            );
                          }}
                          sx={{
                            fontSize: 16,
                            fontWeight: 'medium',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            color: 'red',
                            border: '1px solid red',
                          }}
                        >
                          Deactivate
                        </Button>
                      ) : (
                        <Button
                          onClick={async () => {
                            const customerRef = doc(db, 'users', customer.id);
                            await updateDoc(customerRef, { status: 'active' });
                            setCustomers(
                              customers.map((c) =>
                                c.id === customer.id ? { ...c, status: 'active' } : c
                              )
                            );
                            setFilteredCustomers(
                              filteredCustomers.map((c) =>
                                c.id === customer.id ? { ...c, status: 'active' } : c
                              )
                            );
                          }}
                          sx={{
                            fontSize: 16,
                            fontWeight: 'medium',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            color: 'green',
                            border: '1px solid green',
                          }}
                        >
                          Activate
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/customers/${customer.id}`}
                        style={{
                          fontSize: 16,
                          fontWeight: 'medium',
                          color: '#0063cc',
                          textTransform: 'capitalize',
                          marginRight: '10px',
                        }}
                      >
                        View
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
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default CustomersPage;
