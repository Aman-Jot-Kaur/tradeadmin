import React, { useState, useEffect } from 'react';
import {
    Grid,
    Box,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    TextField
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { db } from '../services/firebase';
import { setDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';
import Sidebar from '../components/Sidebar';
const CustomerViewPage = () => {
    const { id } = useParams();
    const [customer, setCustomer] = useState({});
    const [transactions, setTransactions] = useState([]);
    const [wallet, setWallet] = useState({});
    const [info, setInfo] = useState({});
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const fetchCustomer = async () => {
            const customerRef = doc(db, 'accounts', id);
            const customerSnapshot = await getDoc(customerRef);
            if (customerSnapshot.exists()) {
                setCustomer(customerSnapshot.data());
            }
        };

        const fetchTransactions = async () => {
            const transactionsRef = collection(db, 'transactions');
            const transactionsSnapshot = await getDocs(transactionsRef);
            const transactionsData = transactionsSnapshot?.docs
                ?.map((doc) => ({ id: doc.id, ...doc.data() }))
                .filter((transaction) => transaction.userId === id);
            setTransactions(transactionsData);
        };

        const fetchWallet = async () => {
            const walletRef = doc(db, 'wallet', id);
            const walletSnapshot = await getDoc(walletRef);
            if (walletSnapshot.exists()) {
                setWallet(walletSnapshot.data());
            }
        };

        const fetchInfo = async () => {
            const infoRef = doc(db, 'users', id);
            const infoSnapshot = await getDoc(infoRef);
            if (infoSnapshot.exists()) {
                setInfo(infoSnapshot.data());
            }
        };

        fetchCustomer();
        fetchTransactions();
        fetchWallet();
        fetchInfo();
    }, [id]);

    const formatLabel = (label) => {
        return label
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (match) => match.toUpperCase());
    };
    const handleWalletChange = (index, field, value) => {
        const updatedBalances = [...wallet.balances];
        updatedBalances[index][field] = value;
        setWallet({ ...wallet, balances: updatedBalances });
    };

    const saveWalletUpdates = async () => {
        const walletRef = doc(db, 'wallet', id);
        await updateDoc(walletRef, { balances: wallet.balances });
        setEditing(false);
    };
    const createWallet = async (id) => {
        try {
          // Validate that the id is a non-empty string
          if (typeof id !== "string" || id.trim() === "") {
            throw new Error("Invalid user ID provided to createWallet");
          }
      
          const initialWallet = {
            balances: [
              { label: "Available balance", amount: 0 },
              { label: "Deposit Balance", amount: 0 },
              { label: "P & L Balance", amount: 0 },
              { label: "Withdrawal Balance", amount: 0 },
              { label: "Bonus", amount: 0 },
              { label: "Referral Bonus", amount: 0 },
              { label: "Leverage Balance", amount: 0 },
              { label: "Credit Balance", amount: 0 },
            ],
            userId: id, // Add user ID to the document
          };
      
          console.log("Creating wallet for user ID:", id); // Debug log
      
          // Reference to the specific wallet document
          const walletRef = doc(db, "wallet", id);
      
          // Create or overwrite the document
          await setDoc(walletRef, initialWallet);
      
          console.log("Wallet created successfully!");
        } catch (error) {
          console.error("Error creating wallet:", error);
        }
      };
    return (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'row', md: 'row' }, padding: '20px' }}>
            <Grid item xs={12} md={3} sx={{ padding: '20px', minHeight: '100vh' }}>
                <Sidebar />
            </Grid>
            <Box sx={{ width: '100%', padding: '20px', overflowX: 'auto', flexGrow: 1 , flexDirection: 'column'}}>
                <Typography
                    variant="h4"
                    sx={{
                        marginBottom: 4,
                        fontWeight: 'bold',
                        color: '#333',
                        textTransform: 'uppercase',
                        fontSize: { xs: '2rem', sm: '2.5rem' }
                    }}
                >
                    Customer View
                </Typography>
                {!customer && <Typography variant="body1">Customer not found.</Typography>}
                {customer && (
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="h6"
                                sx={{
                                    marginBottom: 2,
                                    fontWeight: 'bold',
                                    color: '#333',
                                    textTransform: 'uppercase'
                                }}
                            >
                                Account
                            </Typography>
                            <Table sx={{ width: '100%' }}>
                                <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
                                    <TableRow>
                                        <TableCell>Field</TableCell>
                                        <TableCell>Value</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.keys(customer)?.map((key, index) => {
                                        const value = customer[key];
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>{formatLabel(key)}</TableCell>
                                                <TableCell>
                                                    {typeof value === "object" && value !== null
                                                        ? JSON.stringify(value)
                                                        : value || "N/A"}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                            <Typography
                                variant="h6"
                                sx={{
                                    marginBottom: 2,
                                    fontWeight: 'bold',
                                    color: '#333',
                                    textTransform: 'uppercase'
                                }}
                            >
                                Other Info
                            </Typography>
                            <Table sx={{ width: '100%' }}>
                                <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
                                    <TableRow>
                                        <TableCell>Field</TableCell>
                                        <TableCell>Value</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {info && Object.keys(info).length > 0 ? (
                                        Object.keys(info)?.map((key, index) => (
                                            <TableRow key={index}>
                                                <TableCell align="left">{formatLabel(key)}</TableCell>
                                                {key !== 'document' && <TableCell align="right">
                                                    {typeof info[key] === 'object'
                                                        ? JSON.stringify(info[key], null, 2)
                                                        : info[key] || "N/A"}
                                                </TableCell>}
                                                {key === 'documentFront' && <Box
                                                    component="img"
                                                    src={`data:image/jpeg;base64,${info[key]}`}
                                                    alt="Customer"
sx={{ width: '300px', maxWidth: 250, height: 'auto', objectFit: 'cover', mb: 2 }}
                                                />}
                                                {key === 'documentBack' && <Box
                                                    component="img"
                                                    src={`data:image/jpeg;base64,${info[key]}`}
                                                    alt="Customer"
                                                    sx={{ width: '300px', maxWidth: 250, height: 'auto', objectFit: 'cover', mb: 2 }}
                                                />}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={2}>No data available</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="h6"
                                sx={{
                                    marginBottom: 2,
                                    fontWeight: 'bold',
                                    color: '#333',
                                    textTransform: 'uppercase'
                                }}
                            >
                                Wallet
                            </Typography>
                            <Table sx={{ width: '100%' }}>
                                <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
                                <TableRow>
                                        <TableCell>Label</TableCell>
                                        <TableCell>Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {wallet.balances?.map((balance, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                {editing ? (
                                                    <TextField
                                                        value={balance.label}
                                                        onChange={(e) =>
                                                            handleWalletChange(index, 'label', e.target.value)
                                                        }
                                                    />
                                                ) : (
                                                    balance.label
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {editing ? (
                                                    <TextField
                                                        type="number"
                                                        value={balance.amount}
                                                        onChange={(e) =>
                                                            handleWalletChange(index, 'amount', e.target.value)
                                                        }
                                                    />
                                                ) : (
                                                    balance.amount
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {!wallet?.balances?.length && <TableRow><TableCell colSpan={2}> <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={createWallet(id)}
                                >
                                    Create Wallet
                                </Button></TableCell></TableRow>}
                                </TableBody>
                            </Table>
                            <Box sx={{ marginTop: 2 }}>
                                {editing ? (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={saveWalletUpdates}
                                    >
                                        Save Changes
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => setEditing(true)}
                                    >
                                        Edit Wallet
                                    </Button>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                )}

                <Typography
                    variant="h6"
                    sx={{
                        mt: 2,
                        mb: 2,
                        fontWeight: 'bold',
                        color: '#333',
                        textTransform: 'uppercase'
                    }}
                >
                    Transactions
                </Typography>

                {transactions.length === 0 && (
                    <TableRow><TableCell>No transactions available</TableCell></TableRow>
                )}

                {transactions.length !== 0 && (
                    <Table sx={{ width: '100%' }}>
                        <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
                            <TableRow>
                                <TableCell>Timestamp</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map((transaction, index) => (
                                <TableRow key={index}>
                                    <TableCell>{transaction.timestamp?.toDate().toLocaleString()}</TableCell>
                                    <TableCell>{transaction.type}</TableCell>
                                    <TableCell>{transaction.amount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Box>
        </Box>
    );
};

export default CustomerViewPage;
