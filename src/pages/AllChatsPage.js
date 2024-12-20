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

  const currentAdminEmail = localStorage.getItem('adminEmailSA');

  useEffect(() => {
    // Fetch assigned users for the logged-in subadmin
    const fetchData = async () => {
      if (currentAdminEmail) {
        try {
          const subadminsRef = collection(db, 'subadmins');
          const q = query(subadminsRef, where('email', '==', currentAdminEmail));
          
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              const assignedUsersData = doc.data().assignedUsers || [];
              setAssignedUsers(assignedUsersData);
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

        // Use a Map to keep the latest message for each sender
        const latestMessagesMap = new Map();

        Object.entries(data).forEach(([key, message]) => {
          const sender = message.sender;
          if (
            assignedUsers.includes(sender) &&
            (!latestMessagesMap.has(sender) ||
              latestMessagesMap.get(sender).timestamp < message.timestamp)
          ) {
            latestMessagesMap.set(sender, { id: key, ...message });
          }
        });

        // Convert Map to an array of latest messages
        const latestMessages = Array.from(latestMessagesMap.values());

        setChats(latestMessages);
        setFilteredChats(latestMessages);
      } else {
        setChats([]);
        setFilteredChats([]);
      }
    });

    return () => unsubscribe();
  }, [assignedUsers]);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredChats(
      chats.filter((chat) => chat.sender.toLowerCase().includes(query))
    );
  };

  const handleChatSelect = (chat) => {
    navigate(`/chats/${chat.sender}`);
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
          <h1 style={{ textAlign: 'center', width: '50vw' }}>No data available yet</h1>
        )}
      </Box>
    </Box>
  );
};

export default AllChatsPage;
