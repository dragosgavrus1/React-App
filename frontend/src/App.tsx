import {Routes, Route, BrowserRouter as Router} from 'react-router-dom'
import './App.css'
import Car from './models/car'
import CarDetailPage from './pages/CarDetailPage/CarDetailPage'
import CarListPage from './pages/CarListPage/CarListPage'
import CarAddPage from './pages/CarAddPage/CarAddPage'
import { createContext, useEffect, useState } from 'react'
import CarEditPage from './pages/CarEditPage/CarEditPage'
import axios from 'axios'
import { io } from 'socket.io-client';

export const CarsContext = createContext<Car[]>([]);

function App() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isServerOnline, setIsServerOnline] = useState(true);


  useEffect(() => {
    const socket = io('http://localhost:3000', { transports : ['websocket'] });
    // Example of sending a message to the server
    socket.on('newCar', (newCar: any) => {
      console.log('Received new car from server:', newCar);
      const car = new Car(newCar.id, newCar.make, newCar.model, newCar.year, newCar.color);
      setCars((prevCars) => [...prevCars, car]);
    });
  }, []);

  useEffect(() => {
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));

    return () => {
      window.removeEventListener('online', () => setIsOnline(true));
      window.removeEventListener('offline', () => setIsOnline(false));
    };
  }, []);

  

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api');
      const carList = response.data.map((carData: any) => new Car(carData.id, carData.make, carData.model, carData.year, carData.color));
      console.log(cars);
      setCars(carList);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsServerOnline(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!isOnline) {
    return <div>You are currently offline. Please check your internet connection.</div>;
  }

  if (!isServerOnline) {
    return <div>The server is currently down. Please try again later.</div>;
  }

  return (
    <CarsContext.Provider value={cars}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<CarListPage />} />
            <Route path="/car/:id" element={<CarDetailPage  />} />
            <Route path="/add" element={<CarAddPage setCars={setCars}/>} />
            <Route path="/edit/:id" element={<CarEditPage  setCars={setCars}/>} />
          </Routes>

        </div>
      </Router>
    </CarsContext.Provider>
  );
}

export default App
