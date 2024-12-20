import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { db } from '../services/firebase'; // Import the Firestore instance
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore'; // Firestore functions
import Sidebar from '../components/Sidebar';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const currentEmail = localStorage.getItem('adminEmailSA'); // Get the logged-in admin/subadmin email

  useEffect(() => {
    const fetchCustomers = async () => {
      console.log(currentEmail)
      const customersRef = collection(db, 'users'); // Reference to the customers collection
      const customersSnapshot = await getDocs(customersRef); // Use getDocs to retrieve all documents
      const customersData = customersSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((customer) => customer.subadmins?.includes(currentEmail)); // Filter by subadmins array

      setCustomers(customersData);
      setFilteredCustomers(customersData); // Initialize filtered customers
    };
    fetchCustomers();
  }, [currentEmail]);

  const handleDelete = async (id) => {
    const customerRef = doc(db, 'users', id); // Reference to the specific document
    await deleteDoc(customerRef); // Use deleteDoc to delete the document
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
            textTransform: 'uppercase'
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
            sx={{ width: '50%', marginBottom: 2 }}
          />
        </Grid>
        {filteredCustomers.length === 0 ? (
                <h1 style={{textAlign:"center",width:"50vw"}}>no data available yet</h1>
            ) :
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
            <TableRow>
              <TableCell>S.No.</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
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
                <TableCell>{customer.status}</TableCell>
                <TableCell>
                  {customer.status === 'active' ? (
                    <Button 
                      onClick={async () => {
                        const customerRef = doc(db, 'users', customer.id);
                        await updateDoc(customerRef, { status: 'inactive' });
                        setCustomers(customers.map((c) => (c.id === customer.id ? { ...c, status: 'inactive' } : c)));
                        setFilteredCustomers(filteredCustomers.map((c) => (c.id === customer.id ? { ...c, status: 'inactive' } : c)));
                      }}
                      sx={{ 
                        fontSize: 16, 
                        fontWeight: 'medium', 
                        padding: '5px 10px',
                        borderRadius: '5px',
                        color: 'red',
                        border: '1px solid red'
                      }}
                    >
                      Deactivate 
                    </Button>
                  ) : (
                    <Button 
                      onClick={async () => {
                        const customerRef = doc(db, 'users', customer.id);
                        await updateDoc(customerRef, { status: 'active' });
                        setCustomers(customers.map((c) => (c.id === customer.id ? { ...c, status: 'active' } : c)));
                        setFilteredCustomers(filteredCustomers.map((c) => (c.id === customer.id ? { ...c, status: 'active' } : c)));
                      }}
                      sx={{ 
                        fontSize: 16, 
                        fontWeight: 'medium', 
                        padding: '5px 10px',
                        borderRadius: '5px',
                        color: 'green',
                        border: '1px solid green'
                      }}
                    >
                      Activate
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  <Link 
                    to={`/customers/${customer.id}`} 
                    sx={{ 
                      fontSize: 16, 
                      fontWeight: 'medium', 
                      color: '#0063cc',
                      textTransform: 'capitalize',
                      marginRight: 2
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
                      color: 'red'
                    }}
                  >
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

export default CustomersPage;
