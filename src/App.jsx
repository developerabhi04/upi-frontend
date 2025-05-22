import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Checkout from './Components/Checkout';
import AdminPanel from './Components/AdminPanel';
import PaymentStatus from './Components/PaymentStatus';

const App = () => (
  <BrowserRouter>
    <nav>
      <Link to="/">Checkout</Link>
      <Link to="/admin">Admin</Link>
    </nav>

    <Routes>
      <Route path="/" element={<Checkout />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/status/:sessionId" element={<PaymentStatus />} />
    </Routes>
  </BrowserRouter>
);

export default App;