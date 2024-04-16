import express, { Request, Response } from 'express';
import Car from './models/car'; // Fix the casing of the file name
import cors from 'cors';
import { CarList } from './models/controller';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { ICar, CarModel } from './models/CarModel';


dotenv.config();
const PORT = process.env.PORT || 3000;
const MONGOURI = process.env.MONGOURI || 'mongodb://localhost:27017/CarsDB';

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());

const carsController = new CarList();

io.on('connection', (socket) => {

  setInterval(async () => {
    try {
      const car = await carsController.generateAndSaveCar();
      socket.emit('newCar', car);
    } catch (error) {
      console.error('Error generating and saving car:', error);
    }
  }, 1000000);
});


// Get all entities
app.get('/api', async (req: Request, res: Response) => {
  try {
    const cars = await carsController.getCars();
    res.json(cars);
  } catch (error) {
    console.error('Error getting cars:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Get one entity by ID
app.get('/api/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const car = await CarModel.find({id : id});
    if (car) {
      res.json(car);
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (error) {
    console.error('Error getting car by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Create entity
app.post('/api', async (req: Request, res: Response) => {
  try {
    const car = await carsController.addCar(req.body);
    res.status(201).json(car);
  } catch (error) {
    console.error('Error adding car:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update entity
app.put('/api/:id', async (req: Request, res: Response) => {
  try {
    const carId = parseInt(req.params.id);
    const { make, model, year, color } = req.body;

    // Find the car by ID
    const car: any = await CarModel.find({id : carId});
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Update the car properties
    car.make = make;
    car.model = model;
    car.year = year;
    car.color = color;

    // Save the updated car to the database
    await car.save();

    res.json(car);
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete entity
app.delete('/api/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    // Find the car by ID
    const car = await CarModel.findOne({id : id});
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Delete the car from the database
    await car.deleteOne();

    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = app;



// Only start the server if the file is executed directly
if (require.main === module) {
  mongoose.connect(MONGOURI)
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}/api`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
}
