import React, { useState, useEffect } from 'react';
import {
    Grid,
    Box,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';
import Sidebar from '../components/Sidebar';

const CustomerViewPage = () => {
    const { id } = useParams();
    const [customer, setCustomer] = useState({});
    const [transactions, setTransactions] = useState([]);
    const [wallet, setWallet] = useState({});
    const [info, setinfo] = useState({});
    useEffect(() => {
/*************  ✨ Codeium Command ⭐  *************/
        /**
         * Fetches the customer's information from Firestore
         * @async
         * @function
         * @param {string} id - The customer's ID
         * @returns {Promise<void>}
         */
/******  8f2be12a-640e-46c2-9712-0dab1117c382  *******/        const fetchCustomer = async () => {
            const customerRef = doc(db, 'accounts', id);
            const customerSnapshot = await getDoc(customerRef);
            if (customerSnapshot.exists()) {
                setCustomer(customerSnapshot.data());
            }
        };

        const fetchTransactions = async () => {
            const transactionsRef = collection(db, 'transactions');
            const transactionsSnapshot = await getDocs(transactionsRef);
            const transactionsData = transactionsSnapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }))
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
            const walletRef = doc(db, 'users', id);
            const walletSnapshot = await getDoc(walletRef);
            if (walletSnapshot.exists()) {
                setinfo(walletSnapshot.data());
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
    return (
        <Box sx={{ display: 'flex' }}>
            <Grid item xs={2} sx={{ padding: '20px' }}>
                <Sidebar />
            </Grid>
            <Box sx={{ width: '100%', padding: '20px' }}>
                <Typography
                    variant="h4"
                    sx={{
                        marginBottom: 4,
                        fontWeight: 'bold',
                        color: '#333',
                        textTransform: 'uppercase'
                    }}
                >
                    Customer View

                </Typography>
                {!customer && <Typography variant="body1">Customer not found.</Typography>}
                {customer && (
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography
                                variant="h6"
                                sx={{
                                    marginBottom: 2,
                                    fontWeight: 'bold',
                                    color: '#333',
                                    textTransform: 'uppercase'
                                }}
                            >
                                Account              </Typography>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
                                    <TableRow>
                                        <TableCell>Field</TableCell>
                                        <TableCell>Value</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
    {Object.keys(customer).map((key, index) => {
        const value = customer[key];
        return (
            <TableRow key={index}>
                <TableCell>{formatLabel(key)}</TableCell>
                <TableCell>
                    {typeof value === "object" && value !== null
                        ? JSON.stringify(value) // Convert object/array to string
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
                                Other Info             </Typography>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
                                    <TableRow>
                                        <TableCell>Field</TableCell>
                                        <TableCell>Value</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
  {info && Object.keys(info).length > 0 ? (
    Object.keys(info).map((key, index) => (
      <TableRow key={index}>
        <TableCell align="left">{formatLabel(key)}</TableCell>
        <TableCell align="right">
          {typeof info[key] === 'object' ? JSON.stringify(info[key], null, 2) : info[key] || "N/A"}
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={2}>No data available</TableCell>
    </TableRow>
  )}
</TableBody>

                            </Table>
                        </Grid> ̰
                        
                        <Grid item xs={6}>
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
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
                                    <TableRow>
                                        <TableCell>Label</TableCell>
                                        <TableCell>Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {wallet?.balances?.map((balance, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{balance.label}</TableCell>
                                            <TableCell>{balance.amount}</TableCell>
                                        </TableRow>
                                    ))}
                                    {!wallet.length && <TableRow><TableCell colSpan={2}>No wallet available</TableCell></TableRow>}
                                </TableBody>
                            </Table>
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
                {!transactions.length && <TableRow><TableCell >No transactions available</TableCell></TableRow>}

                {transactions.length !== 0 && <Table sx={{ minWidth: 650 }}>
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
                }
            </Box>
        </Box>
    );
};

export default CustomerViewPage;