import { Box, Button, TextField, List, ListItem, ListItemButton, ListItemText, Chip } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Link ,useParams,} from 'react-router-dom';
import { collection, getDocs, doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore'; 
import { db } from '../../services/firebase';

const SubadminForm = (props) => {
    const { formData, handleInputChange, handleSubmit, isUpdateForm = false } = props
    const [users, setUsers] = React.useState([]);
    const [selectedUsers, setSelectedUsers] = React.useState(formData.assignedUsers ?? []);
const params=useParams();
    useEffect(() => {
        const fetchUsers = async () => {
            const usersRef = collection(db, 'users');
            const usersSnapshot = await getDocs(usersRef);
            const usersData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setUsers(usersData);
        };
        fetchUsers();

        if (isUpdateForm) {
            const subadminDocRef = doc(db, 'subadmins', params.id);
            getDoc(subadminDocRef).then((doc) => {
                if (doc.exists()) {
                    const subadminData = doc.data();
                    const assignedUsers = subadminData.assignedUsers;
                    setSelectedUsers(assignedUsers);
                }
            });
        }
    }, [isUpdateForm, params.id]);

    const handleUserChange = async (user) => {
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
            let subadmins = userData.subadmins ?? [];
            if (newUserList.includes(user.email)) {
                subadmins.push(formData.email);
            } else {
                subadmins = subadmins.filter((email) => email !== formData.email);
            }
            await updateDoc(userDocRef, { subadmins });
        }
    };

    return (
        <Box onSubmit={handleSubmit}
            component={'form'}
            sx={{ width: "400px", margin: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>
            <TextField
                label="Name"
                name='name'
                required
                size='small'
                fullWidth
                value={formData.name ?? ''}
                onChange={handleInputChange}
            />
            <TextField
                label="Email"
                name='email'
                required
                size='small'
                fullWidth
                value={formData.email ?? ''}
                onChange={handleInputChange} />

            <TextField
                label="Password"
                name='password'
                required
                size='small'
                fullWidth
                value={formData.password ?? ''}
                onChange={handleInputChange}
            />

            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {users.map((user) => (
                    <ListItem key={user.email} disablePadding>
                        <ListItemButton onClick={() => handleUserChange(user)}>
                            <ListItemText primary={user.email} />
                            {selectedUsers.includes(user.email) ? <Chip label="Assigned" /> : <Chip label="Unassigned" />}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "end", alignItems: "center", gap: "10px" }}>
                <Button  >
                    <Link style={{ textDecoration: "none" }}
                        to="/subadmin" >Cancel</Link>
                </Button>
                {
                    isUpdateForm ? <Button variant="contained" type="submit">Update Subadmin</Button> :
                        <Button variant="contained" type="submit">Add Subadmin</Button>
                }
            </Box>

        </Box>
    )
}

export default SubadminForm