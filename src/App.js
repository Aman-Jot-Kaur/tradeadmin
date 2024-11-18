import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
import EditSubadminPage from "./pages/EdotSubadminPage"
import AddRequestPage from './pages/AddRequestPage';
import "./App.css"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/trades" element={<TradesPage />} />
        <Route path="/requests" element={<RequestsPage />} />

        <Route path="/trades/add" element={<AddTradePage />} />
        <Route path="/trades/:id/edit" element={<EditTradePage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/subadmin" element={<SubAdminPage />} />
        <Route path="/subadmin/add" element={<AddSubadminPage />} />
        <Route path='/subadmin/edit/:id' element={<EditSubadminPage />} />

        <Route path='/customers/:id' element={<CustomerViewPage />} />
        <Route path="/requests/:id" element={<EditRequestPage />} />
        <Route path="/requests/add" element={<AddRequestPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;