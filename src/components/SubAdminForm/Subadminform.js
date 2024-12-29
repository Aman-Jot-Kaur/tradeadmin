import {
  Box,
  Button,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';
import { db } from '../../services/firebase';
import { auth } from '../../services/firebase';

const SubadminForm = (props) => {
  const { formData, handleInputChange, handleSubmit, isUpdateForm = false } = props;
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(formData?.assignedUsers || []);
  const params = useParams();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);
        const usersData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchSubadminData = async () => {
      if (isUpdateForm) {
        try {
          const subadminDocRef = doc(db, 'subadmins', params.id);
          const docSnap = await getDoc(subadminDocRef);
          if (docSnap.exists()) {
            const subadminData = docSnap.data();
            setSelectedUsers(subadminData?.assignedUsers || []);
          }
        } catch (error) {
          console.error('Error fetching subadmin data:', error);
        }
      }
    };

    fetchUsers();
    fetchSubadminData();
  }, [isUpdateForm, params.id]);

  const handleUserChange = async (user) => {
    try {
      const newUserList = selectedUsers.includes(user.email)
        ? selectedUsers.filter((email) => email !== user.email)
        : [...selectedUsers, user.email];

      setSelectedUsers(newUserList);
      handleInputChange({ target: { name: 'assignedUsers', value: newUserList } });

      // Update user document
      const userDocRef = doc(db, 'users', user.id);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        let subadmins = userData?.subadmins || [];
        if (newUserList.includes(user.email)) {
          subadmins.push(formData.email);
        } else {
          subadmins = subadmins.filter((email) => email !== formData?.email);
        }
        await updateDoc(userDocRef, { subadmins });
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handlePasswordChange = async () => {
    if (auth && formData?.password) {
      try {
        await updatePassword(auth.currentUser, formData.password);
        const subadminRef = doc(db, 'subadmins', params.id);
        await updateDoc(subadminRef, formData);
        console.log('Password updated successfully');
      } catch (error) {
        console.error('Error updating password:', error);
      }
    }
  };

  return (
    <Box
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
        handlePasswordChange();
      }}
      component={'form'}
      sx={{
        width: '100%',
        maxWidth: '600px',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '20px',
        '@media (max-width: 600px)': {
          padding: '10px',
        },
      }}
    >
      <TextField
        label="Name"
        name="name"
        required
        size="small"
        fullWidth
        value={formData?.name || ''}
        onChange={handleInputChange}
      />
      <TextField
        label="Email"
        name="email"
        required
        size="small"
        fullWidth
        value={formData?.email || ''}
        onChange={handleInputChange}
      />
      <TextField
        label="Password"
        name="password"
        required
        size="small"
        fullWidth
        value={formData?.password || ''}
        onChange={handleInputChange}
      />

      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {users.map((user) => (
          <ListItem key={user.email} disablePadding>
            <ListItemButton onClick={() => handleUserChange(user)}>
              <ListItemText primary={user?.email} />
              {selectedUsers?.includes(user?.email) ? (
                <Chip label="Assigned" />
              ) : (
                <Chip label="Unassigned" />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box
        sx={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'end',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <Button>
          <Link style={{ textDecoration: 'none' }} to="/subadmin">
            Cancel
          </Link>
        </Button>
        {isUpdateForm ? (
          <Button variant="contained" type="submit">
            Update Subadmin
          </Button>
        ) : (
          <Button variant="contained" type="submit">
            Add Subadmin
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default SubadminForm;
