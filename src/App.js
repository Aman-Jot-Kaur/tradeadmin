import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import LoginPage from './pages/LoginPage';
import TradesPage from './pages/TradesPage';
import CustomersPage from './pages/CustomerPage';
import SubAdminPage from './pages/Subadmin';
import AddTradePage from './pages/AddTradePage';
import EditTradePage from './pages/EditTradePage';
import EditRequestPage from './pages/EditRequestPagee';
import RequestsPage from './pages/RequestsPage';
import CustomerViewPage from './pages/CustomerInfo';
import AddSubadminPage from './pages/AddSubadminPage';
import EditSubadminPage from "./pages/EdotSubadminPage";
import AddRequestPage from './pages/AddRequestPage';
import "./App.css";
import { auth } from './services/firebase';
import AllChatsPage from './pages/AllChatsPage';
import ChatViewPage from './pages/ChatDetailPage'; // Assuming you have a ChatViewPage component for individual chat
import NewsPage from './pages/News';
import NewsFormPage from './pages/NewsForm';
import SignupPage from './pages/Signup';
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Optional loading spinner or screen
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* If the user is logged in, redirect them from login/signup to TradesPage */}
        <Route
          path="/"
          element={user ? <Navigate to="/trades" replace /> : <SignupPage />}
        />
        <Route
          path="/login"
          element={<LoginPage/>}
        />
        {/* Protected Routes */}
        <Route
          path="/trades"
          element={user ? <TradesPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/requests"
          element={user ? <RequestsPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/trades/add"
          element={user ? <AddTradePage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/trades/:id/edit"
          element={user ? <EditTradePage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/customers"
          element={user ? <CustomersPage /> : <Navigate to="/" replace />}
        />
          <Route
          path="/news"
          element={user ? <NewsPage/> : <Navigate to="/" replace />}
        />
        <Route
          path="/chats"
          element={user ? <AllChatsPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/chats/:sender"
          element={user ? <ChatViewPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/subadmin"
          element={user ? <SubAdminPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/subadmin/add"
          element={user ? <AddSubadminPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/subadmin/edit/:id"
          element={user ? <EditSubadminPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/customers/:id"
          element={user ? <CustomerViewPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/requests/:id"
          element={user ? <EditRequestPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/requests/add"
          element={user ? <AddRequestPage /> : <Navigate to="/" replace />}
        />
         <Route path="/news/add" element={<NewsFormPage />} />
         <Route path="/news/edit/:id" element={<NewsFormPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
