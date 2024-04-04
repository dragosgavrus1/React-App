"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarList = void 0;
const car_1 = __importDefault(require("./car"));
class CarList {
    constructor() {
        this.id = 21;
        this.cars = [
            new car_1.default(1, "Toyota", "Corolla", 2022, "Blue"),
            new car_1.default(2, "Honda", "Civic", 2021, "Red"),
            new car_1.default(3, "Ford", "Mustang", 2023, "Yellow"),
            new car_1.default(4, "Chevrolet", "Camaro", 2020, "Black"),
            new car_1.default(5, "Toyota", "Camry", 2024, "Silver"),
            new car_1.default(6, "BMW", "3 Series", 2023, "Silver"),
            new car_1.default(7, "Audi", "A4", 2022, "Gray"),
            new car_1.default(8, "Mercedes-Benz", "E-Class", 2023, "Black"),
            new car_1.default(9, "Volkswagen", "Golf", 2022, "Green"),
            new car_1.default(10, "Subaru", "Outback", 2021, "Blue"),
            new car_1.default(11, "Lexus", "RX", 2024, "Red"),
            new car_1.default(12, "Mazda", "CX-5", 2023, "Black"),
            new car_1.default(13, "Honda", "Accord", 2024, "White"),
            new car_1.default(14, "Kia", "Sorento", 2023, "Silver"),
            new car_1.default(15, "Toyota", "Prius", 2023, "Green"),
            new car_1.default(16, "Chevrolet", "Equinox", 2022, "Black"),
            new car_1.default(17, "Honda", "Pilot", 2023, "Blue"),
            new car_1.default(18, "Ford", "Fusion", 2022, "Gray"),
            new car_1.default(19, "Tesla", "Model 3", 2023, "Red"),
            new car_1.default(20, "Nissan", "Altima", 2022, "White")
        ];
    }
    addCar(car) {
        let carToAdd = new car_1.default(this.id, car.make, car.model, car.year, car.color);
        this.cars.push(carToAdd);
        this.id++;
        return car;
    }
}
exports.CarList = CarList;
