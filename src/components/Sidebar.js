import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  Divider 
} from '@mui/material';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
const Sidebar = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('adminEmailSA');
    navigate('/login')

  };

  return (
    <Box 
      sx={{ 
        backgroundColor: '#f0f0f0', 
        height: '80vh', 
        padding: 2, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
      
      }}
    >
      <Typography 
        variant="h4" 
        sx={{ 
          marginBottom: 4, 
          fontWeight: 'bold', 
          color: '#333', 
          textTransform: 'uppercase',
          textAlign: 'center'
        }}
      >
        Menu
      </Typography>
      <List>
        <ListItem button component={Link} to="/trades">
          <ListItemText 
            primary="Trades" 
            sx={{ 
              fontSize: 18, 
              fontWeight: 'medium', 
              color: '#0063cc',
              textTransform: 'capitalize'
            }}
          />
        </ListItem>
        <ListItem button component={Link} to="/customers">
          <ListItemText 
            primary="Customers" 
            sx={{ 
              fontSize: 18, 
              fontWeight: 'medium', 
              color: '#0063cc',
              textTransform: 'capitalize'
            }}
          />
        </ListItem>
        <ListItem button component={Link} to="/subadmin">
          <ListItemText 
            primary="Sub Admins" 
            sx={{ 
              fontSize: 18, 
              fontWeight: 'medium', 
              color: '#0063cc',
              textTransform: 'capitalize'
            }}
          />
        </ListItem>
        <ListItem button component={Link} to="/chats">
          <ListItemText 
            primary="Chats" 
            sx={{ 
              fontSize: 18, 
              fontWeight: 'medium', 
              color: '#0063cc',
              textTransform: 'capitalize'
            }}
          />
        </ListItem>
        <ListItem button component={Link} to="/requests">
          <ListItemText 
            primary="Requests" 
            sx={{ 
              fontSize: 18, 
              fontWeight: 'medium', 
              color: '#0063cc',
              textTransform: 'capitalize'
            }}
          />
        </ListItem>
        <ListItem button component={Link} to="/news">
          <ListItemText 
            primary="News" 
            sx={{ 
              fontSize: 18, 
              fontWeight: 'medium', 
              color: '#0063cc',
              textTransform: 'capitalize'
            }}
          />
        </ListItem>
      </List>
      <Divider sx={{ margin: '20px 0', width: '100%' }} />
      <Button 
        variant="contained" 
        color="error" 
        onClick={handleLogout} 
        sx={{ 
          fontSize: 18, 
          fontWeight: 'bold', 
          padding: '10px 20px',
          borderRadius: '10px'
        }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default Sidebar;