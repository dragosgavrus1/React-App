import { Request, Response } from 'express';
import  Car from './car';
import { faker } from '@faker-js/faker';
import {CarModel, ICar}  from './CarModel';


export class CarList {

  public async addCar(carData: any): Promise<ICar> {
    // Create a new CarModel instance with the provided car data
    const newCar = new CarModel(carData);

    // Save the new car to the database
    const savedCar = await newCar.save();

    return savedCar;
}


  public async generateAndSaveCar(): Promise<ICar> {
    // Generate car data using Faker
    const carData = {
        make: faker.vehicle.manufacturer(),
        model: faker.vehicle.model(),
        year: faker.date.past().getFullYear(),
        color: faker.vehicle.color(),
    };

    // Save the generated car to the database
    const newCar = new CarModel(carData);

    // Save the new car to the database
    const savedCar = await newCar.save();

    return savedCar;
  }


  public async getCars(): Promise<any[]> {
    try {
        // Retrieve only the required fields from the database
        const cars = await CarModel.find({}, { _id: 0, id: 1, make: 1, model: 1, year: 1, color: 1 });

        // Return the retrieved documents
        return cars;
    } catch (error) {
        console.error('Error getting cars:', error);
        return [];
    }
}
}