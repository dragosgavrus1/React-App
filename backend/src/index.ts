import express, { Request, Response } from 'express';
import Car from './models/car'; // Fix the casing of the file name
import cors from 'cors';
import { CarList } from './models/controller';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { ICar, CarModel } from './models/CarModel';
import { IBrand, BrandModel } from './models/CarBrand';


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
  console.log('A client connected');

  // Start emitting events only for this connected client
  const interval = setInterval(async () => {
      try {
          const car = await carsController.generateAndSaveCar();
          socket.emit('newCar', car);
      } catch (error) {
          console.error('Error generating and saving car:', error);
      }
  }, 30000);

  // Stop emitting events when the client disconnects
  socket.on('disconnect', () => {
      console.log('A client disconnected');
      clearInterval(interval);
  });
});

// app.get('/api/cars/updates', async (req, res) => {
//   try {
//     const car = await carsController.generateAndSaveCar();
//     res.json(car);
//   } catch (error) {
//     console.error('Error generating and saving car:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });


// Get all entities
app.get('/api/cars', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) ;
    const cars = await carsController.getCars(page);
    res.json(cars);
  } catch (error) {
    console.error('Error getting cars:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Get one entity by ID
app.get('/api/cars/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const car = await CarModel.find({id : id});
    if (car.length === 0) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    console.error('Error getting car by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Create entity
app.post('/api/cars', async (req: Request, res: Response) => {
  try {
    const car = await carsController.addCar(req.body);
    res.status(201).json(car);
  } catch (error) {
    console.error('Error adding car:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update entity
app.put('/api/cars/:id', async (req: Request, res: Response) => {
  try {
    const carId = parseInt(req.params.id);
    const { make, model, year, color } = req.body;

    // Find the car by ID
    const car: any = await CarModel.findOne({ id: carId });
    if (car.length === 0) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const brand = await BrandModel.findOne({brand : make});
    if (!brand) {
      res.status(404).json({ message: 'Brand not found' });
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
app.delete('/api/cars/:id', async (req: Request, res: Response) => {
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

app.get('/api/brands', async (req: Request, res: Response) => {
  try {
    const itemsPerPage = 50; // Number of brands per page
    let page = parseInt(req.query.page as string) || 0; // Default to page 1 if page query parameter is not provided
    const skip = page  * itemsPerPage; // Calculate the number of brands to skip

    const brands = await BrandModel.find({}, { _id: 0, brand_id: 1, brand: 1 })
      .skip(skip)
      .limit(itemsPerPage);

    res.json(brands);
  } catch (error) {
    console.error('Error getting brands:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Get all cars by given brand
app.get('/api/brands/:id/cars', async (req: Request, res: Response) => {
  try {
    const brand_id = req.params.id;
    const brand = await BrandModel.findOne({brand_id : brand_id});
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    const cars = await CarModel.find({make : brand.brand}, { _id: 0, id: 1, make: 1, model: 1, year: 1, color: 1 });
    if (!cars) {
      return res.status(404).json({ message: 'No cars found' });
    }
    res.json(cars);
  } catch (error) {
    console.error('Error getting cars by brand:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get one brand by ID
app.get('/api/brands/:id', async (req: Request, res: Response) => {
  try {
    const brand_id = req.params.id;
    const brand = await BrandModel.findOne({brand_id : brand_id});
    if (brand) {
      res.json(brand);
    } else {
      res.status(404).json({ message: 'Brand not found' });
    }
  } catch (error) {
    console.error('Error getting brand by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create brand
app.post('/api/brands', async (req: Request, res: Response) => {
  try {
    if(await BrandModel.findOne({ brand: req.body.brand })){
      return res.status(400).json({ message: 'Brand already exists' });
    }
    const brand = new BrandModel(req.body);
    const savedBrand = await brand.save();
    res.status(201).json(savedBrand);
  } catch (error) {
    console.error('Error adding brand:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update brand
app.put('/api/brands/:id', async (req: Request, res: Response) => {
  try {
    const brand_id = req.params.id;
    const newBrand  = req.body;
    // Find the brand by ID
    const brand: any = await BrandModel.findOne({brand_id : brand_id});
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    // Update the brand properties
    brand.brand = newBrand.brand;

    // Save the updated brand to the database
    await brand.save();

    res.json(brand);
  } catch (error) {
    console.error('Error updating brand:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete brand
app.delete('/api/brands/:id', async (req: Request, res: Response) => {
  try {
    const brand_id = req.params.id;

    // Find the brand by ID
    const brand = await BrandModel.findOne({brand_id : brand_id});
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    // Delete the brand from the database
    await brand.deleteOne();

    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    console.error('Error deleting brand:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = app;

mongoose.connect(MONGOURI)
  .then(async () => {
    console.log('Connected to MongoDB');
    // Script to generate cars
    // Start the server after generating cars
    server.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}/api`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });