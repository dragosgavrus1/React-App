"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const controller_1 = require("./models/controller");
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const CarModel_1 = require("./models/CarModel");
const CarBrand_1 = require("./models/CarBrand");
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const MONGOURI = process.env.MONGOURI || 'mongodb://localhost:27017/CarsDB';
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
app.use(express_1.default.json());
const carsController = new controller_1.CarList();
io.on('connection', (socket) => {
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const car = yield carsController.generateAndSaveCar();
            socket.emit('newCar', car);
        }
        catch (error) {
            console.error('Error generating and saving car:', error);
        }
    }), 10000);
});
// Get all entities
app.get('/api/cars', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cars = yield carsController.getCars();
        res.json(cars);
    }
    catch (error) {
        console.error('Error getting cars:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
// Get one entity by ID
app.get('/api/cars/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const car = yield CarModel_1.CarModel.find({ id: id });
        if (car.length === 0) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.json(car);
    }
    catch (error) {
        console.error('Error getting car by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
// Create entity
app.post('/api/cars', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const car = yield carsController.addCar(req.body);
        res.status(201).json(car);
    }
    catch (error) {
        console.error('Error adding car:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
// Update entity
app.put('/api/cars/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const carId = parseInt(req.params.id);
        const { make, model, year, color } = req.body;
        // Find the car by ID
        const car = yield CarModel_1.CarModel.findOne({ id: carId });
        if (car.length === 0) {
            return res.status(404).json({ message: 'Car not found' });
        }
        const brand = yield CarBrand_1.BrandModel.findOne({ brand: make });
        if (!brand) {
            res.status(404).json({ message: 'Brand not found' });
        }
        // Update the car properties
        car.make = make;
        car.model = model;
        car.year = year;
        car.color = color;
        // Save the updated car to the database
        yield car.save();
        res.json(car);
    }
    catch (error) {
        console.error('Error updating car:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
// Delete entity
app.delete('/api/cars/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        // Find the car by ID
        const car = yield CarModel_1.CarModel.findOne({ id: id });
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        // Delete the car from the database
        yield car.deleteOne();
        res.json({ message: 'Car deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting car:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
// Get all brands
app.get('/api/brands', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const brands = yield CarBrand_1.BrandModel.find({}, { _id: 0, brand_id: 1, brand: 1 });
        res.json(brands);
    }
    catch (error) {
        console.error('Error getting brands:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
// Get all cars by given brand
app.get('/api/brands/:name/cars', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const name = req.params.name;
        const cars = yield CarModel_1.CarModel.find({ make: name }, { _id: 0, id: 1, make: 1, model: 1, year: 1, color: 1 });
        if (!cars) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        res.json(cars);
    }
    catch (error) {
        console.error('Error getting cars by brand:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
// Get one brand by ID
app.get('/api/brands/:name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const name = req.params.name;
        const brand = yield CarBrand_1.BrandModel.findOne({ brand: name });
        if (brand) {
            res.json(brand);
        }
        else {
            res.status(404).json({ message: 'Brand not found' });
        }
    }
    catch (error) {
        console.error('Error getting brand by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
// Create brand
app.post('/api/brands', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const brand = new CarBrand_1.BrandModel(req.body);
        const savedBrand = yield brand.save();
        res.status(201).json(savedBrand);
    }
    catch (error) {
        console.error('Error adding brand:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
// Update brand
app.put('/api/brands/:name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const brandName = req.params.name;
        const newBrand = req.body;
        // Find the brand by ID
        const brand = yield CarBrand_1.BrandModel.findOne({ brand: brandName });
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        // Update the brand properties
        brand.brand = newBrand.brand;
        // Save the updated brand to the database
        yield brand.save();
        res.json(brand);
    }
    catch (error) {
        console.error('Error updating brand:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
// Delete brand
app.delete('/api/brands/:name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const brandName = req.params.name;
        // Find the brand by ID
        const brand = yield CarBrand_1.BrandModel.findOne({ brand: brandName });
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        // Delete the brand from the database
        yield brand.deleteOne();
        res.json({ message: 'Brand deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting brand:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
module.exports = app;
mongoose_1.default.connect(MONGOURI)
    .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
        console.log(`Server is running on port http://localhost:${PORT}/api`);
    });
})
    .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
