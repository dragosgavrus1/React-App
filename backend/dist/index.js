"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const car_1 = __importDefault(require("./models/car")); // Fix the casing of the file name
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Sample data for testing
const cars = [
    new car_1.default(1, 'Toyota', 'Camry', 2020, 'red'),
    new car_1.default(2, 'Honda', 'Accord', 2021, 'blue'),
    new car_1.default(3, 'Ford', 'Mustang', 2019, 'black'),
];
app.use(express_1.default.json());
// Get all entities
app.get('/cars', (req, res) => {
    res.json(cars.map(car => ({
        id: car.getId(),
        make: car.getMake(),
        model: car.getModel(),
        year: car.getYear(),
        color: car.getColor(),
    })));
});
// Get one entity by ID
app.get('/cars/:id', (req, res) => {
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
    }
    else {
        res.status(404).json({ message: 'Car not found' });
    }
});
// Create entity
app.post('/cars', (req, res) => {
    const { make, model, year, color } = req.body;
    const id = cars.length + 1;
    const newCar = new car_1.default(id, make, model, year, color);
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
app.put('/cars/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { make, model } = req.body;
    const car = cars.find((c) => c.getId() === id);
    if (car) {
        car.setMake(make);
        car.setModel(model);
        res.json({
            id: car.getId(),
            make: car.getMake(),
            model: car.getModel(),
            year: car.getYear(),
            color: car.getColor(),
        });
    }
    else {
        res.status(404).json({ message: 'Car not found' });
    }
});
// Delete entity
app.delete('/cars/:id', (req, res) => {
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
    }
    else {
        res.status(404).json({ message: 'Car not found' });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
