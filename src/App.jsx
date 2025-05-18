import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Checkout from './Components/Checkout';
import AdminVpaConfig from './Components/AdminVpaConfig';


const App = () => (
  <BrowserRouter>
    <nav style={{ padding: '1rem', background: '#f5f5f5' }}>
      <Link to="/" style={{ marginRight: 10 }}>Checkout</Link>
      <Link to="/admin">Admin VPA Config</Link>
    </nav>
    <Routes>
      <Route path="/" element={<Checkout />} />
      <Route path="/admin" element={<AdminVpaConfig />} />
    </Routes>
  </BrowserRouter>
);

export default App;
