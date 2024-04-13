"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarList = void 0;
const car_1 = __importDefault(require("./car"));
const faker_1 = require("@faker-js/faker");
class CarList {
    constructor() {
        this.id = 1;
        this.cars = [];
    }
    initalizeCars() {
        for (let i = 0; i < 20; i++) {
            this.generateCar();
        }
    }
    addCar(car) {
        let carToAdd = new car_1.default(this.id, car.make, car.model, car.year, car.color);
        this.cars.push(carToAdd);
        this.id++;
        return carToAdd;
    }
    generateCar() {
        const car = {
            make: faker_1.faker.vehicle.manufacturer(),
            model: faker_1.faker.vehicle.model(),
            year: faker_1.faker.date.past().getFullYear(),
            color: faker_1.faker.vehicle.color(),
        };
        return this.addCar(car);
    }
}
exports.CarList = CarList;
