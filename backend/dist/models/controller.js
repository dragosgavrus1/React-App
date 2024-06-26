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
const CarBrand_1 = require("./CarBrand");
class CarList {
    getCarsByBrand(page, brand) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageSize = 50;
                const skip = page * pageSize;
                // Retrieve only the required fields from the database
                const cars = yield CarModel_1.CarModel.find({ make: brand }, { _id: 0, id: 1, make: 1, model: 1, year: 1, color: 1 })
                    .skip(skip)
                    .limit(pageSize);
                // Return the retrieved documents
                return cars;
            }
            catch (error) {
                console.error('Error getting cars:', error);
                return [];
            }
        });
    }
    addCar(carData) {
        return __awaiter(this, void 0, void 0, function* () {
            const brand = yield CarBrand_1.BrandModel.findOne({ brand: carData.make });
            if (!brand) {
                throw new Error('Brand not found');
            }
            // Create a new CarModel instance with the provided car data
            const newCar = new CarModel_1.CarModel(carData);
            // Save the new car to the database
            const savedCar = yield newCar.save();
            return savedCar;
        });
    }
    generateAndSaveCar() {
        return __awaiter(this, void 0, void 0, function* () {
            let randomBrand = Math.floor(Math.random() * 999950);
            let brand = yield CarBrand_1.BrandModel.findOne({ brand_id: randomBrand });
            while (!brand) {
                randomBrand = Math.floor(Math.random() * 999950);
                brand = yield CarBrand_1.BrandModel.findOne({ brand_id: randomBrand });
            }
            const carData = {
                make: brand.brand,
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
    getCars(page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageSize = 50;
                const skip = page * pageSize;
                // Retrieve only the required fields from the database
                const cars = yield CarModel_1.CarModel.find({}, { _id: 0, id: 1, make: 1, model: 1, year: 1, color: 1 })
                    .skip(skip)
                    .limit(pageSize);
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
