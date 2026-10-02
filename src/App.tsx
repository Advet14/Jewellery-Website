import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Home } from './pages/Home';
import { CreateBill } from './pages/CreateBill';
import { InvoicePreview } from './pages/InvoicePreview';
import { RecentBills } from './pages/RecentBills';
import { VerifyBill } from './pages/VerifyBill';
import { Shop } from './pages/Shop';
import { Login } from './pages/Login';

import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<VerifyBill />} />
        <Route path="/v/:verificationId" element={<VerifyBill />} />
        <Route path="/shop" element={<Shop />} />

        {/* Protected admin pages */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/create-bill" element={<CreateBill />} />
          <Route path="/preview" element={<InvoicePreview />} />
          <Route path="/recent-bills" element={<RecentBills />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;