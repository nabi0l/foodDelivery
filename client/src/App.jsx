import './styles/main.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/MainNavbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import RestaurantListing from './pages/RestaurantListing';
import RestaurantMenu from './components/RestaurantMenu';
import ContactUs from './pages/ContactUs';
import AuthPage from './pages/auth/AuthPage';
import AboutUs from './pages/AboutUs';
import Favorites from './pages/Favorites';
import Orders from './pages/Orders';

function App() {
  return (
    <Router>
      <Navbar/>
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/restaurants" element={<RestaurantListing />} />
          <Route path="/restaurants/:id" element={<RestaurantMenu />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage initialMode="login" />} />
          <Route path="/signup" element={<AuthPage initialMode="signup" />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </main>
      <Footer/>
    </Router>
  );
}

export default App;
