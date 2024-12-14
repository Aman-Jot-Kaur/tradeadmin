import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, TextField, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { db } from '../services/firebase'; // Import the Firestore instance
import { collection, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore'; // Firestore functions
import Sidebar from '../components/Sidebar';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [filteredCustomers, setFilteredCustomers] = useState([]); // State for filtered customers
  const [userRole, setUserRole] = useState(null); // Store the current user's role
  const [loadingRole, setLoadingRole] = useState(true); // Loading state for role fetch

  // Fetch current user's role from Firestore (subadmins collection)
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const currentUserEmail = localStorage.getItem('adminEmailSA') // Replace with the actual email of the logged-in user
        const subadminsRef = collection(db, 'subadmins');
        const q = query(subadminsRef, where('email', '==', currentUserEmail)); // Query by email
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0].data();
          setUserRole(userDoc.role || null);
        } else {
          setUserRole(null); // User not found
        } 
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole(null); // Fallback on error
      } finally {
        setLoadingRole(false); // Stop loading
      }
    };

    fetchUserRole();
  }, []);

  // Fetch customers (subadmins) on mount
  useEffect(() => {
    const fetchCustomers = async () => {
      const customersRef = collection(db, 'subadmins');
      const customersSnapshot = await getDocs(customersRef);
      const customersData = customersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCustomers(customersData);
      setFilteredCustomers(customersData);
    };
    fetchCustomers();
  }, []);

  // Delete a customer
  const handleDelete = async (id) => {
    const customerRef = doc(db, 'subadmins', id);
    await deleteDoc(customerRef);
    setCustomers(customers.filter((customer) => customer.id !== id));
    setFilteredCustomers(filteredCustomers.filter((customer) => customer.id !== id));
  };

  // Handle search input
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    if (query) {
      const filtered = customers.filter((customer) =>
        customer.name?.toLowerCase().includes(query) ||
        customer.email?.toLowerCase().includes(query)
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  };

  if (loadingRole) {
    return <CircularProgress />; // Display spinner while role is loading
  }

  if (userRole !== 'superadmin') {
    return (
      <Box sx={{ textAlign: 'center', padding: '50px' }}>
        <Typography variant="h5" color="error" gutterBottom>
          Not Authorized
        </Typography>
        <Typography variant="body1">
          You do not have the necessary permissions to access this page.
        </Typography>
        <Button variant="contained" color="primary" component={Link} to="/">
          Go to Home
        </Button>
      </Box>
    );
  }

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
          Subadmins
        </Typography>
        <Grid container justifyContent="space-between" alignItems="center" mb={2}>
          <TextField
            variant="outlined"
            placeholder="Search by name or email"
            value={searchQuery}
            onChange={handleSearch}
            sx={{ width: '50%', marginBottom: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/subadmin/add"
            sx={{
              fontSize: 18,
              fontWeight: 'bold',
              padding: '10px 20px',
              borderRadius: '10px',
            }}
          >
            Add Subadmin
          </Button>
        </Grid>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
            <TableRow>
              <TableCell>S.No.</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Password</TableCell>
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
                <TableCell>
                  <Link
                    to={`/subadmin/edit/${customer.id}`}
                    style={{
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
                    style={{
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

export default CustomersPage;
