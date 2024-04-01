import {Routes, Route, BrowserRouter as Router} from 'react-router-dom'
import './App.css'
import Car from './models/car'
import CarDetailPage from './pages/CarDetailPage/CarDetailPage'
import CarListPage from './pages/CarListPage/CarListPage'
import CarAddPage from './pages/CarAddPage/CarAddPage'
import { useEffect, useState } from 'react'
import CarEditPage from './pages/CarEditPage/CarEditPage'
import axios from 'axios'


function App() {

  const [cars, setCars] = useState<Car[]>([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api');
      const carList = response.data.map((carData: any) => new Car(carData.id, carData.make, carData.model, carData.year, carData.color));
      console.log(cars);
      setCars(carList);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    // Fetch data from the API when the component mounts
    fetchData();
  }, []);


  return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<CarListPage cars={cars}  />} />
            <Route path="/car/:id" element={<CarDetailPage cars={cars} />} />
            <Route path="/add" element={<CarAddPage cars={cars}  setCars={setCars}/>} />
            <Route path="/edit/:id" element={<CarEditPage cars={cars}  setCars={setCars}/>} />
          </Routes>

        </div>
      </Router>
  );
}

export default App
