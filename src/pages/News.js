import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  TextField,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase'; // Firestore instance
import Sidebar from '../components/Sidebar';

const NewsPage = () => {
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
      setFilteredNews(newsData); // Update the filtered list as well
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  // Refetch news whenever the component is mounted
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
          news.desc.toLowerCase().includes(query)
      )
    );
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid item xs={2} sx={{ padding: '20px' }}>
        {/* Sidebar */}
        <Sidebar />
      </Grid>
      <Box sx={{ width: '100%', padding: '20px' }}>
        <Typography variant="h5" sx={{ marginBottom: 4, fontWeight: 'bold' }}>
          News
        </Typography>

        {/* Search Bar */}
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Search by title or description"
          value={searchQuery}
          onChange={handleSearch}
          sx={{ marginBottom: '20px' }}
        />

        {/* Add News Button */}
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/news/add"
          sx={{ marginBottom: '20px' }}
        >
          Add News
        </Button>

        {/* News Table */}
        {filteredNews?.length === 0 ? (
          <Typography align="center" sx={{ marginTop: 4 }}>
            No news available yet
          </Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S.No.</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredNews.map((news, index) => (
                <TableRow key={news.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{news.title}</TableCell>
                  <TableCell>
                    {news.description.length > 50
                      ? `${news.description.substring(0, 50)}...`
                      : news.description}
                  </TableCell>
                  <TableCell>
                    <img
                      src={news.imageUrl}
                      alt="News"
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  </TableCell>
                  <TableCell>
  {news.timestamp
    ? new Date(news?.timestamp?.toDate())?.toLocaleString()
    : 'N/A'}
</TableCell>

                  <TableCell>
                    <Link to={`/news/edit/${news.id}`}>Edit</Link>
                    <Button
                      onClick={() => handleDelete(news.id)}
                      sx={{ marginLeft: 2 }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>
    </Box>
  );
};

export default NewsPage;
