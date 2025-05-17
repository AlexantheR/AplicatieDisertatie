import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Navbar from './components/Navbar';
import PizzaMenu from './screens/PizzaMenu';
import Cartscreen from './screens/Cartscreen';
import Registerscreen from './screens/Registerscreen';
import Loginscreen from './screens/Loginscreen';
import Orderscreen from './screens/Orderscreen';
import Adminscreen from './screens/Adminscreen';
import FirstPage from './screens/FirstPage';
import DrinksMenu from './screens/DrinksMenu';
import Book from './screens/Book';
import ThankYou from './screens/ThankYou';
import PaymentScreen from './screens/PaymentScreen';
import Makeuserpremium from './screens/MakeUserPremium';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<FirstPage />} />
          <Route path="/pizzamenu" element={<PizzaMenu />} />
          <Route path="/drinks" element={<DrinksMenu />} />
          <Route path="/cart" element={<Cartscreen />} />
          <Route path="/register" element={<Registerscreen />} />
          <Route path="/login" element={<Loginscreen />} />
          <Route path="/orders" element={<Orderscreen />} />
          <Route path="/admin" element={<Adminscreen />} />
          <Route path="/book" element={<Book />} />
          <Route path="/thankyou" element={<ThankYou />} />
          <Route path="/payment" element={<PaymentScreen />} />
          <Route path="/makeuserpremium" element={<Makeuserpremium />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
