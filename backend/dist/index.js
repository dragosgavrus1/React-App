"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const controller_1 = require("./models/controller");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const PORT = process.env.PORT || 3000;
// Sample data for testing
const carsController = new controller_1.CarList();
app.use(express_1.default.json());
// Get all entities
app.get('/api', (req, res) => {
    const cars = carsController.cars;
    res.json(cars.map(car => ({
        id: car.getId(),
        make: car.getMake(),
        model: car.getModel(),
        year: car.getYear(),
        color: car.getColor(),
    })));
});
// Get one entity by ID
app.get('/api/:id', (req, res) => {
    const cars = carsController.cars;
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
app.post('/api', (req, res) => {
    const newCar = req.body;
    const addedCar = carsController.addCar(newCar);
    res.json(addedCar);
});
// Update entity
app.put('/api/:id', (req, res) => {
    const cars = carsController.cars;
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
    }
    else {
        res.status(404).json({ message: 'Car not found' });
    }
});
// Delete entity
app.delete('/api/:id', (req, res) => {
    const cars = carsController.cars;
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
module.exports = app;
// Only start the server if the file is executed directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port http://localhost:${PORT}/api`);
    });
}
