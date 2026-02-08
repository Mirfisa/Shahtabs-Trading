import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import AboutUs from './components/AboutUs';
import CarList from './components/CarList';
import CarDetails from './components/CarDetails';
import DataPage from './components/DataPage';
import Footer from './components/Footer';
import TopBar from './components/TopBar';
import Header from './components/Header';


function App() {
  return (
    <Router>
      <TopBar />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/cars" element={<CarList />} />
        <Route path="/car/:id" element={<CarDetails />} />
        <Route path="/data" element={<DataPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
