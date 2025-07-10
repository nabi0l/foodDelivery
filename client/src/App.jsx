import './styles/main.css';
import 'leaflet/dist/leaflet.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/MainNavbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import RestaurantListing from './pages/RestaurantListing';
import RestaurantMenu from './components/RestaurantMenu';
import ContactUs from './pages/ContactUs';
import AuthPage from './pages/auth/AuthPage';
import AboutUs from './pages/AboutUs';
import Favorites from './pages/Favorites';
import CheckoutPage from './components/Checkout';
import Orders from './pages/Orders';

// Restaurant Dashboard Components
import RestaurantDashboard from './pages/restaurant/RestaurantDashboard';
import RestaurantHome from './pages/restaurant/RestaurantHome';
import OrderManagement from './pages/restaurant/Orders';
import MenuManagement from './pages/restaurant/Menu';
import RestaurantAnalytics from './pages/restaurant/RestaurantAnalytics';
import ReviewsManagement from './pages/restaurant/Reviews';

//Admin Dashboard Components
import AdminDahboard from './pages/admin/AdminDashboard';
import Analaytics from './pages/admin/Analytics';
import OrderManagements from './pages/admin/OrderManagement';
import RestaurantManagement from './pages/admin/RestaurantManagement';
import SupportManagement from './pages/admin/SupportManagement';
import UserManagement from './pages/admin/UserManagement';



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
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<Orders />} />
          
          {/* Restaurant Dashboard Routes */}
          <Route path="/restaurant-dashboard" element={<RestaurantDashboard />}>
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<RestaurantHome />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="menu" element={<MenuManagement />} />
            <Route path="analytics" element={<RestaurantAnalytics />} />
            <Route path="reviews" element={<ReviewsManagement />} />
          </Route>

          {/**Admin Dashboard Routes */}
          <Route path='/admin-dashboard' element={<AdminDahboard/>}>
            <Route index element={<Navigate to="home" replace/>}/>
               <Route path='home' element={<AdminDahboard/>}/>
               <Route path='analaytics' element={<Analaytics/>}/>
               <Route path='order' element={<OrderManagement/>}/>
               <Route path='restaurant' element={<RestaurantManagement/>}/>
               <Route path='support' element={<SupportManagement/>}/>
               <Route path='user' element={<UserManagement/>}/>
          </Route>

        </Routes>
      </main>
      <Footer/>
    </Router>
  );
}

export default App;
