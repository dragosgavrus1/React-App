import express, { Request, Response } from 'express';
import Car from './models/car'; // Fix the casing of the file name
import cors from 'cors';

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// Sample data for testing
const cars: Car[] = [
  new Car(1, "Toyota", "Corolla", 2022, "Blue"),
  new Car(2, "Honda", "Civic", 2021, "Red"),
  new Car(3, "Ford", "Mustang", 2023, "Yellow"),
  new Car(4, "Chevrolet", "Camaro", 2020, "Black"),
  new Car(5, "Toyota", "Camry", 2024, "Silver"),
  new Car(6, "BMW", "3 Series", 2023, "Silver"),
  new Car(7, "Audi", "A4", 2022, "Gray"),
  new Car(8, "Mercedes-Benz", "E-Class", 2023, "Black"),
  new Car(9, "Volkswagen", "Golf", 2022, "Green"),
  new Car(10, "Subaru", "Outback", 2021, "Blue"),
  new Car(11, "Lexus", "RX", 2024, "Red"),
  new Car(12, "Mazda", "CX-5", 2023, "Black"),
  new Car(13, "Honda", "Accord", 2024, "White"),
  new Car(14, "Kia", "Sorento", 2023, "Silver"),
  new Car(15, "Toyota", "Prius", 2023, "Green"),
  new Car(16, "Chevrolet", "Equinox", 2022, "Black"),
  new Car(17, "Honda", "Pilot", 2023, "Blue"),
  new Car(18, "Ford", "Fusion", 2022, "Gray"),
  new Car(19, "Tesla", "Model 3", 2023, "Red"),
  new Car(20, "Nissan", "Altima", 2022, "White")
];

app.use(express.json());

// Get all entities
app.get('/api', (req: Request, res: Response) => {
  res.json(cars.map(car => ({
    id: car.getId(),
    make: car.getMake(),
    model: car.getModel(),
    year: car.getYear(),
    color: car.getColor(),
  })));
});

// Get one entity by ID
app.get('/api/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const car = cars.find((c) => c.getId() === id);
  if (car) {
    res.json({
      id: car.getId(),
      make: car.getMake(),
      model: car.getModel(),
      year: car.getYear(),
      color: car.getColor(),
    });
  } else {
    res.status(404).json({ message: 'Car not found' });
  }
});

// Create entity
app.post('/api', (req: Request, res: Response) => {
  const { make, model, year, color } = req.body;
  const id = cars.length + 1;
  const newCar = new Car(id, make, model, year, color);
  cars.push(newCar);
  res.status(201).json({
    id: newCar.getId(),
    make: newCar.getMake(),
    model: newCar.getModel(),
    year: newCar.getYear(),
    color: newCar.getColor(),
  });
});

// Update entity
app.put('/api/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { make, model, year, color } = req.body;
  const car = cars.find((c) => c.getId() === id);
  if (car) {
    car.setMake(make);
    car.setModel(model);
    car.setYear(year);
    car.setColor(color);
    res.json({
      id: car.getId(),
      make: car.getMake(),
      model: car.getModel(),
      year: car.getYear(),
      color: car.getColor(),
    });
  } else {
    res.status(404).json({ message: 'Car not found' });
  }
});

// Delete entity
app.delete('/api/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = cars.findIndex((c) => c.getId() === id);
  if (index !== -1) {
    const deletedCar = cars.splice(index, 1)[0];
    res.json({
      id: deletedCar.getId(),
      make: deletedCar.getMake(),
      model: deletedCar.getModel(),
      year: deletedCar.getYear(),
      color: deletedCar.getColor(),
    });
  } else {
    res.status(404).json({ message: 'Car not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
