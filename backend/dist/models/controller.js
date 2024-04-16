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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarList = void 0;
const faker_1 = require("@faker-js/faker");
const CarModel_1 = require("./CarModel");
class CarList {
    addCar(carData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create a new CarModel instance with the provided car data
            const newCar = new CarModel_1.CarModel(carData);
            // Save the new car to the database
            const savedCar = yield newCar.save();
            return savedCar;
        });
    }
    generateAndSaveCar() {
        return __awaiter(this, void 0, void 0, function* () {
            // Generate car data using Faker
            const carData = {
                make: faker_1.faker.vehicle.manufacturer(),
                model: faker_1.faker.vehicle.model(),
                year: faker_1.faker.date.past().getFullYear(),
                color: faker_1.faker.vehicle.color(),
            };
            // Save the generated car to the database
            const newCar = new CarModel_1.CarModel(carData);
            // Save the new car to the database
            const savedCar = yield newCar.save();
            return savedCar;
        });
    }
    getCars() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Retrieve only the required fields from the database
                const cars = yield CarModel_1.CarModel.find({}, { _id: 0, id: 1, make: 1, model: 1, year: 1, color: 1 });
                // Return the retrieved documents
                return cars;
            }
            catch (error) {
                console.error('Error getting cars:', error);
                return [];
            }
        });
    }
}
exports.CarList = CarList;
