import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  Drawer, 
  IconButton 
} from '@mui/material';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Sidebar = () => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('adminEmailSA');
    navigate('/login');
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* For larger screens */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' }, 
          backgroundColor: '#f0f0f0', 
          height: '100vh', 
          padding: 2, 
          flexDirection: 'column', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          width: '250px',
          paddingBottom: '40px', // Added extra padding at the bottom
        }}
      >
        <Typography
          variant="h4"
          sx={{
            marginBottom: 4,
            fontWeight: 'bold',
            color: '#333',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          Menu
        </Typography>
        <List>
          <ListItem button component={Link} to="/trades">
            <ListItemText 
              primary="Trades" 
              sx={{ fontSize: 18, fontWeight: 'medium', color: '#0063cc', textTransform: 'capitalize' }}
            />
          </ListItem>
          <ListItem button component={Link} to="/customers">
            <ListItemText 
              primary="Customers" 
              sx={{ fontSize: 18, fontWeight: 'medium', color: '#0063cc', textTransform: 'capitalize' }}
            />
          </ListItem>
          <ListItem button component={Link} to="/subadmin">
            <ListItemText 
              primary="Sub Admins" 
              sx={{ fontSize: 18, fontWeight: 'medium', color: '#0063cc', textTransform: 'capitalize' }}
            />
          </ListItem>
          <ListItem button component={Link} to="/chats">
            <ListItemText 
              primary="Chats" 
              sx={{ fontSize: 18, fontWeight: 'medium', color: '#0063cc', textTransform: 'capitalize' }}
            />
          </ListItem>
          <ListItem button component={Link} to="/requests">
            <ListItemText 
              primary="Requests" 
              sx={{ fontSize: 18, fontWeight: 'medium', color: '#0063cc', textTransform: 'capitalize' }}
            />
          </ListItem>
          <ListItem button component={Link} to="/contact">
            <ListItemText 
              primary="Admin Contact" 
              sx={{ fontSize: 18, fontWeight: 'medium', color: '#0063cc', textTransform: 'capitalize' }}
            />
          </ListItem>
          <ListItem button component={Link} to="/payment">
            <ListItemText 
              primary="Payment Details" 
              sx={{ fontSize: 18, fontWeight: 'medium', color: '#0063cc', textTransform: 'capitalize' }}
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
            borderRadius: '10px',
            alignSelf: 'center', // Center horizontally
            marginBottom: 10, // Move slightly up from the bottom
          }}
        >
          Logout
        </Button>
      </Box>

      {/* Mobile Drawer (Menu Bar) */}
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={toggleDrawer}
        sx={{
          display: { xs: 'block', md: 'none' },
        }}
      >
        <Box sx={{ width: 250, padding: 2 }}>
          <IconButton onClick={toggleDrawer} sx={{ alignSelf: 'flex-end' }}>
            <CloseIcon />
          </IconButton>
          <Typography 
            variant="h4" 
            sx={{ marginBottom: 4, fontWeight: 'bold', color: '#333', textAlign: 'center' }}
          >
            Menu
          </Typography>
          <List>
            <ListItem button component={Link} to="/trades" onClick={toggleDrawer}>
              <ListItemText 
                primary="Trades" 
                sx={{ fontSize: 18, fontWeight: 'medium', color: '#0063cc', textTransform: 'capitalize' }}
              />
            </ListItem>
            <ListItem button component={Link} to="/customers" onClick={toggleDrawer}>
              <ListItemText 
                primary="Customers" 
                sx={{ fontSize: 18, fontWeight: 'medium', color: '#0063cc', textTransform: 'capitalize' }}
              />
            </ListItem>
            <ListItem button component={Link} to="/subadmin" onClick={toggleDrawer}>
              <ListItemText 
                primary="Sub Admins" 
                sx={{ fontSize: 18, fontWeight: 'medium', color: '#0063cc', textTransform: 'capitalize' }}
              />
            </ListItem>
            <ListItem button component={Link} to="/chats" onClick={toggleDrawer}>
              <ListItemText 
                primary="Chats" 
                sx={{ fontSize: 18, fontWeight: 'medium', color: '#0063cc', textTransform: 'capitalize' }}
              />
            </ListItem>
            <ListItem button component={Link} to="/requests" onClick={toggleDrawer}>
              <ListItemText 
                primary="Requests" 
                sx={{ fontSize: 18, fontWeight: 'medium', color: '#0063cc', textTransform: 'capitalize' }}
              />
            </ListItem>
            <ListItem button component={Link} to="/contact" onClick={toggleDrawer}>
              <ListItemText 
                primary="Admin Contact" 
                sx={{ fontSize: 18, fontWeight: 'medium', color: '#0063cc', textTransform: 'capitalize' }}
              />
            </ListItem>
            <ListItem button component={Link} to="/payment" onClick={toggleDrawer}>
              <ListItemText 
                primary="Payment Details" 
                sx={{ fontSize: 18, fontWeight: 'medium', color: '#0063cc', textTransform: 'capitalize' }}
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
              borderRadius: '10px',
              alignSelf: 'center',
            }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      {/* Mobile Menu Button */}
      <IconButton
        sx={{ display: { xs: 'block', md: 'none' }, position: 'fixed', top: 20, left: 20 }}
        onClick={toggleDrawer}
      >
        <MenuIcon />
      </IconButton>
    </Box>
  );
};

export default Sidebar;
