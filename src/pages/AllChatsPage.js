import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { rtdb, db } from '../services/firebase';
import { Grid, Box, TextField } from '@mui/material';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

const AllChatsPage = () => {
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [assignedUsers, setAssignedUsers] = useState([]);
  const navigate = useNavigate();

  const currentAdminEmail = localStorage.getItem('adminEmailSA'); // Get subadmin email from local storage

  useEffect(() => {
    // Fetch assigned users for the logged-in subadmin from Firestore collection
    const fetchData = async () => {
      if (currentAdminEmail) {
        try {
          const subadminsRef = collection(db, 'subadmins');
          const q = query(subadminsRef, where('email', '==', currentAdminEmail)); // Query to find subadmin by email
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              const assignedUsersData = doc.data().assignedUsers || [];
              console.log('Assigned Users:', assignedUsersData);
              setAssignedUsers(assignedUsersData); // Set the array of assigned users
            });
          } else {
            console.log('No subadmin found with this email');
          }
        } catch (error) {
          console.error('Error fetching assigned users:', error);
        }
      }
    };

    fetchData();
  }, [currentAdminEmail]);

  useEffect(() => {
    const messagesRef = ref(rtdb, 'messages');

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const chatList = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));

        // Filter chats to include only assigned users' chats
        const filtered = chatList.filter((chat) =>
assignedUsers.includes(chat.sender)
        );

        setChats(filtered);
        setFilteredChats(filtered);
      } else {
        setChats([]);
        setFilteredChats([]);
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, [assignedUsers]);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredChats(
      chats.filter((chat) => chat.sender.toLowerCase().includes(query))
    );
  };

  const handleChatSelect = (chat) => {
    navigate(`/chats/${chat.sender}`); // Navigate to chat detail
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid item xs={2} sx={{ padding: '20px' }}>
        <Sidebar />
      </Grid>
      <Box sx={{ width: '100%', padding: '20px' }}>
        <h2 style={{ marginBottom: '20px' }}>Chats</h2>

        <TextField
          variant="outlined"
          fullWidth
          placeholder="Search by Sender"
          value={searchQuery}
          onChange={handleSearch}
          sx={{ marginBottom: '20px' }}
        />

        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              style={{
                marginBottom: '15px',
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
              onClick={() => handleChatSelect(chat)}
            >
              <p><strong>{chat.sender}</strong></p>
              <p>{chat.text}</p>
              <p style={{ color: '#aaa' }}>
                {new Date(chat.timestamp).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
            <h1 style={{textAlign:"center",width:"50vw"}}>no data available yet</h1>
        
        )}
      </Box>
    </Box>
  );
};

export default AllChatsPage;
