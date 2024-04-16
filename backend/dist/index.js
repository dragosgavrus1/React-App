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
    }), 1000000);
});
// Get all entities
app.get('/api', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
app.get('/api/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        console.log(id);
        const car = yield CarModel_1.CarModel.find({ id: id });
        console.log(car);
        if (car) {
            res.json(car);
        }
        else {
            res.status(404).json({ message: 'Car not found' });
        }
    }
    catch (error) {
        console.error('Error getting car by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
// Create entity
app.post('/api', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
app.put('/api/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const carId = parseInt(req.params.id);
        const { make, model, year, color } = req.body;
        // Find the car by ID
        const car = yield CarModel_1.CarModel.find({ id: carId });
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
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
app.delete('/api/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
module.exports = app;
// Only start the server if the file is executed directly
if (require.main === module) {
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
}
