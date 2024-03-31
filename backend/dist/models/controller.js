"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarController = void 0;
const carList = [
    { id: 1, make: 'Toyota', model: 'Camry', year: 2020 },
    { id: 2, make: 'Honda', model: 'Accord', year: 2019 },
    { id: 3, make: 'Ford', model: 'Mustang', year: 2021 },
];
class CarController {
    getCars(req, res) {
        res.json(carList);
    }
    getCarById(req, res) {
        const carId = parseInt(req.params.id);
        const car = carList.find((car) => car.id === carId);
        if (car) {
            res.json(car);
        }
        else {
            res.status(404).json({ message: 'Car not found' });
        }
    }
}
exports.CarController = CarController;
