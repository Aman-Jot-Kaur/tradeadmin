import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, onValue, set, push } from 'firebase/database';
import { rtdb } from '../services/firebase';
import { Grid, Box, Typography, TextField, Button } from '@mui/material';
import Sidebar from '../components/Sidebar';

const ChatDetailPage = () => {
  const { sender } = useParams();
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const supportEmail = "support";

  useEffect(() => {
    if (!sender) return;

    const messagesRef = ref(rtdb, 'messages');
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const messages = Object.entries(data)
          .filter(([key, value]) =>
            (value.sender === sender && value.receiver === "support") ||
            (value.sender === "support" && value.receiver === sender)
          )
          .map(([key, value]) => ({
            id: key,
            ...value,
          }))
          .sort((a, b) => a.timestamp - b.timestamp);

        setChatMessages(messages);
      }
    });

    return () => unsubscribe();
  }, [sender, supportEmail]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const messagesRef = ref(rtdb, 'messages');
    const newMessageRef = push(messagesRef);

    const messageData = {
      sender: "support",
      text: newMessage.trim(),
      timestamp: Date.now(),
      receiver: sender,
    };

    set(newMessageRef, messageData)
      .then(() => setNewMessage(''))
      .catch((error) => console.error('Error sending message:', error));
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Invalid Date';
    return new Date(timestamp).toLocaleString('en-IN', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'column', overflow: 'hidden' }}>
      <Grid container spacing={2}>
        {/* Sidebar */}
        <Grid item xs={12} sm={3} sx={{ backgroundColor: '#f4f4f4', padding: '10px' }}>
          <Sidebar />
        </Grid>

        {/* Chat Container */}
        <Grid item xs={12} sm={9} sx={{ flexGrow: 1, padding: '20px', backgroundColor: '#f9f9f9', overflow: 'auto' }}>
          <Typography variant="h6" sx={styles.header}>
            Chat with {sender}
          </Typography>

          <Box sx={styles.chatMessages}>
            {chatMessages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent:
                    message.sender === supportEmail ? 'flex-end' : 'flex-start',
                  marginBottom: '10px',
                }}
              >
                <Box
                  sx={
                    message.sender === supportEmail
                      ? styles.supportMessage
                      : styles.userMessage
                  }
                >
                  <Typography>{message.text}</Typography>
                  <Typography variant="caption" sx={{ marginTop: '5px', display: 'block' }}>
                    {formatDate(message.timestamp)}
                  </Typography>
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          <Box sx={styles.sendMessageContainer}>
            <TextField
              fullWidth
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              multiline
              rows={2}
              variant="outlined"
            />
            <Button variant="contained" onClick={handleSendMessage} sx={styles.sendButton}>
              Send
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChatDetailPage;

const styles = {
  header: {
    fontSize: '1.8rem',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
    borderBottom: '2px solid #007bff',
    paddingBottom: '10px',
  },
  chatMessages: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: '10px',
    backgroundColor: '#ecf0f1',
    borderRadius: '10px',
    marginBottom: '20px',
  },
  supportMessage: {
    textAlign: 'right',
    backgroundColor: '#007bff',
    color: '#ffffff',
    padding: '10px',
    borderRadius: '10px',
    marginBottom: '10px',
    maxWidth: '70%',
  },
  userMessage: {
    textAlign: 'left',
    backgroundColor: '#f1f1f1',
    color: '#333',
    padding: '10px',
    borderRadius: '10px',
    marginBottom: '10px',
    maxWidth: '70%',
  },
  sendMessageContainer: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: '10px',
    borderRadius: '10px',
    marginTop: '10px',
  },
  sendButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
  },
};
