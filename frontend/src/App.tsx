import {Routes, Route, BrowserRouter as Router} from 'react-router-dom'
import './App.css'
import Car from './models/car'
import CarDetailPage from './pages/CarDetailPage/CarDetailPage'
import CarListPage from './pages/CarListPage/CarListPage'
import CarAddPage from './pages/CarAddPage/CarAddPage'
import { useState } from 'react'
import CarEditPage from './pages/CarEditPage/CarEditPage'


function App() {

  const [cars, setCars] = useState([
    new Car(1, "Toyota", "Corolla", 2022, "Blue"),
    new Car(2, "Honda", "Civic", 2021, "Red"),
    new Car(3, "Ford", "Mustang", 2023, "Yellow"),
    new Car(4, "Chevrolet", "Camaro", 2020, "Black"),
  ]);

  //const [car, setCar] = useState<Car | null>(null);

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
