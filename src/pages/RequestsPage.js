import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { db } from '../services/firebase'; 
import { collection, getDocs, doc, query, where, deleteDoc } from 'firebase/firestore'; 
import Sidebar from '../components/Sidebar';

const RequestsPage = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [assignedUsers, setAssignedUsers] = useState([]);
  // const currentAdminEmail = localStorage.getItem('adminEmailSA'); 

  useEffect(() => {
    const fetchSubadminData = async () => {
      var currentAdminEmail= await localStorage.getItem('adminEmailSA');
      if (currentAdminEmail) {
        try {
          const subadminsRef = collection(db, 'subadmins');
          const q = query(subadminsRef, where('email', '==', currentAdminEmail)); 
          
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              const assignedUsersData = doc.data().assignedUsers || [];
              console.log('Assigned Users:', assignedUsersData);
              setAssignedUsers(assignedUsersData); 
            });
          } else {
            console.log('No subadmin document found', currentAdminEmail);
          }
        } catch (error) {
          console.error('Error fetching subadmin data:', error);
        }
      }
    };

    fetchSubadminData();
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      if (assignedUsers.length > 0) {
        const customersRef = collection(db, 'WithdrawRequest');
        const customersSnapshot = await getDocs(customersRef);
        const customersData = customersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filteredCustomers = customersData.filter((customer) =>
          assignedUsers.includes(customer.email)
        );

        filteredCustomers.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds); 

        setCustomers(filteredCustomers);
      }
    };

    fetchCustomers();
  }, [assignedUsers]);

  const handleDelete = async (id) => {
    const customerRef = doc(db, 'WithdrawRequest', id);
    await deleteDoc(customerRef);
    setCustomers(customers.filter((customer) => customer.id !== id));
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.email?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    customer.userId.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#f9f9f9', mt: 4 }}>
      <Sidebar sx={{ flex: 1, maxWidth: '250px', borderRight: '1px solid #ddd' }} />

      <Box sx={{ flex: 3, padding: '20px', overflowY: 'auto' }}>
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

        <Grid container justifyContent="space-between" alignItems="center" mb={2}>
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
              '@media (max-width: 600px)': {
                width: '100%',
              },
            }}
          />
          <Button 
            variant="contained" 
            color="primary" 
            component={Link} 
            to="/requests/add"
            sx={{ fontWeight: 'bold', textTransform: 'capitalize',  mt: 4 }}
          >
            Add Request
          </Button>
        </Grid>

        {filteredCustomers.length === 0 ? (
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              width: "100%",
              color: "#888",
              marginTop: "20px",
            }}
          >
            No data available yet
          </Typography>
        ) : (
          <Table sx={{ width: '100%', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>S.No.</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Requested method</TableCell>
                <TableCell>Requested type</TableCell>
                <TableCell>Requested Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.map((customer, index) => (
                <TableRow key={customer.id} sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{customer.userId}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.method}</TableCell>
                  <TableCell>{customer.type}</TableCell>
                  <TableCell>{customer.amount}</TableCell>
                  <TableCell>{customer.status}</TableCell>
                  <TableCell>{customer.totalAmount}</TableCell>
                  <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                      component={Link}
                      to={`/requests/${customer.id}`}
                      sx={{
                        fontSize: '14px',
                        color: '#1976d2',
                        textTransform: 'capitalize',
                        padding: 0,
                        minWidth: 'auto',
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(customer.id)}
                      sx={{
                        fontSize: '14px',
                        color: 'red',
                        textTransform: 'capitalize',
                        padding: 0,
                        minWidth: 'auto',
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>
    </Box>
  );
};

export default RequestsPage;
