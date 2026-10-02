import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { CreateBill } from './pages/CreateBill';
import { InvoicePreview } from './pages/InvoicePreview';
import { RecentBills } from './pages/RecentBills';
import { VerifyBill } from './pages/VerifyBill';
import { Shop } from './pages/Shop';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-bill" element={<CreateBill />} />
        <Route path="/preview" element={<InvoicePreview />} />
        <Route path="/recent-bills" element={<RecentBills />} />
        <Route path="/verify" element={<VerifyBill />} />
        <Route path="/shop" element={<Shop />} />
      </Routes>
    </Router>
  );
}

export default App;
