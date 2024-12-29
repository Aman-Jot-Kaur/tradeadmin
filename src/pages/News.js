import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  TextField,
  IconButton,
  Tooltip,
  Paper,
  Avatar,
  useTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Sidebar from '../components/Sidebar';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const NewsPage = () => {
  const theme = useTheme();
  const [newsList, setNewsList] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchNews = async () => {
    try {
      const newsCollection = collection(db, 'news');
      const newsSnapshot = await getDocs(newsCollection);
      const newsData = newsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNewsList(newsData);
      setFilteredNews(newsData);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'news', id));
      setNewsList(newsList.filter((news) => news.id !== id));
      setFilteredNews(filteredNews.filter((news) => news.id !== id));
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredNews(
      newsList.filter(
        (news) =>
          news.title.toLowerCase().includes(query) ||
          news.description.toLowerCase().includes(query)
      )
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
      <Grid item xs={12} sm={2} sx={{ padding: '20px', display: { xs: 'none', sm: 'block' } }}>
        <Sidebar />
      </Grid>
      <Box
        sx={{
          width: '100%',
          padding: '20px',
          marginTop: { xs: 2, sm: 0 },
          backgroundColor: theme.palette.background.default,
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 4, fontWeight: 'bold' }}>
          News Management
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Search news by title or description..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <SearchIcon sx={{ marginRight: 1 }} />,
            }}
            sx={{
              marginRight: 2,
              width: { xs: '100%', sm: '60%' },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/news/add"
            startIcon={<AddCircleOutlineIcon />}
            sx={{
              height: '56px',
              paddingX: 4,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }}
          >
            Add News
          </Button>
        </Box>

        {filteredNews.length === 0 ? (
          <Typography variant="h6" align="center" sx={{ marginTop: 4, color: theme.palette.text.secondary }}>
            No news available yet.
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: theme.palette.primary.light }}>
                <TableRow>
                  <TableCell>S.No.</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredNews.map((news, index) => (
                  <TableRow key={news.id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{news.title}</TableCell>
                    <TableCell>
                      {news.description.length > 50
                        ? `${news.description.substring(0, 50)}...`
                        : news.description}
                    </TableCell>
                    <TableCell>
                      <Avatar
                        src={news.imageUrl}
                        alt="News"
                        variant="rounded"
                        sx={{ width: 50, height: 50 }}
                      />
                    </TableCell>
                    <TableCell>
                      {news.timestamp
                        ? new Date(news.timestamp.toDate()).toLocaleString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton component={Link} to={`/news/edit/${news.id}`}>
                          <EditIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(news.id)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default NewsPage;
