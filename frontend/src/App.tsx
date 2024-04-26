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
import BrandListPage from './pages/BrandListPage/BrandListPage'
import BrandAddPage from './pages/BrandAddPage/BrandAddPage'
import BrandEditPage from './pages/BrandEditPage/BrandEditPage'

export const CarsContext = createContext<Car[]>([]);
export const BrandsContext = createContext<{ brand_id: number, brand: string }[]>([]);
export const ServerStatusContext = createContext<boolean>(true);

function App() {
  const [cars, setCars] = useState<Car[]>([]);
  const [brands, setBrands] = useState<{ brand_id: number, brand: string }[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isServerOnline, setIsServerOnline] = useState(true);
  const [page, setPage] = useState(0);


  useEffect(() => {
    
    const socket = io('http://localhost:3000', { transports: ['websocket'] });
  
    socket.on('newCar', (newCar: any) => {
      setIsServerOnline(true);
      console.log('Received new car from server:', newCar);
      const car = new Car(newCar.id, newCar.make, newCar.model, newCar.year, newCar.color);
      setCars((prevCars) => [...prevCars, car]);
    });
  
    socket.on('connect_error', () => {
      setIsServerOnline(false);
    });
  
    return () => {
      socket.close();
    };
  }, []);
  

  useEffect(() => {
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));

    return () => {
      window.removeEventListener('online', () => setIsOnline(true));
      window.removeEventListener('offline', () => setIsOnline(false));
    };
  }, []);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/cars?page=${page}`);
        const carList = response.data.map((carData: any) => new Car(carData.id, carData.make, carData.model, carData.year, carData.color));
        if (page === 0) {
          setCars(carList);
        } else {
          // Append the fetched cars to the existing list
          setCars((prevCars) => [...prevCars, ...carList]);
        }

        setIsServerOnline(true); // Server is online when data is successfully fetched
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsServerOnline(false);
      }
    };

    const fetchBrands = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/brands?page=${page}`);
        const brandList = response.data.map((brand: any) => ({ brand_id: brand.brand_id, brand: brand.brand }));
        setBrands(brandList);
        console.log('brands:', brandList);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };
    

    fetchData();
    fetchBrands();
  }, []);

  // const addRandom = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:3000/api/cars/updates');
  //     setIsServerOnline(true);
  //     const newCar = new Car(response.data.id, response.data.make, response.data.model, response.data.year, response.data.color);
  //     console.log('Received new car from server:', newCar);
  //     setCars((prevCars) => [...prevCars, newCar]);
  //   } catch (error) {
  //     setIsServerOnline(false);
  //     console.error('Error fetching updates:', error);
  //   }
  // };

  // useEffect(() => {
  //   const fetchDataInterval = setInterval(addRandom, 30000);

  //   return () => clearInterval(fetchDataInterval);
  // }, [addRandom, 30000]);

  useEffect(() => {
    if (isOnline && isServerOnline) {
      // Retrieve and execute pending API calls
      const pendingApiCalls = JSON.parse(localStorage.getItem('pendingApiCalls') || '[]');
      pendingApiCalls.forEach(async (apiCall: any) => {
        try {
          console.log('Executing pending API call:', apiCall);
          await axios(apiCall);
          // Remove the successfully executed API call from local storage
          localStorage.setItem('pendingApiCalls', JSON.stringify(pendingApiCalls.filter((call: any) => call !== apiCall)));
        } catch (error) {
          console.error('Error executing pending API call:', error);
        }
      });
    }
  }, [isOnline, isServerOnline]);

  if (!isOnline) {
    return <div>You are currently offline. Please check your internet connection.</div>;
  }



  return (
    <CarsContext.Provider value={cars}>
      <BrandsContext.Provider value={brands}>
        <ServerStatusContext.Provider value={isServerOnline}>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<CarListPage setCars={setCars} />} />
                <Route path="/car/:id" element={<CarDetailPage  />} />
                <Route path="/add" element={<CarAddPage setCars={setCars}/>} />
                <Route path="/edit/:id" element={<CarEditPage  setCars={setCars}/>} />
                <Route path='/brands' element={<BrandListPage setBrands={setBrands} />} />
                <Route path='/brands/add' element={<BrandAddPage/>} />
                <Route path='/brands/edit/:id' element={<BrandEditPage/>} />
              </Routes>

            </div>
          </Router>
        </ServerStatusContext.Provider>
      </BrandsContext.Provider>
    </CarsContext.Provider>
  );
}

export default App
