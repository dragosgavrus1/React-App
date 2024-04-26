import { Request, Response } from 'express';
import  Car from './car';
import { faker } from '@faker-js/faker';
import {CarModel, ICar}  from './CarModel';
import { BrandModel } from './CarBrand';


export class CarList {

  public async addCar(carData: any): Promise<ICar> {
    const brand = await BrandModel.findOne({brand : carData.make});
    if (!brand) {
      throw new Error('Brand not found');
    }
    // Create a new CarModel instance with the provided car data
    const newCar = new CarModel(carData);

    // Save the new car to the database
    const savedCar = await newCar.save();

    return savedCar;
  }


  public async generateAndSaveCar(): Promise<ICar> {

    let randomBrand = Math.floor(Math.random() * 999950);
    let brand = await BrandModel.findOne({brand_id : randomBrand});
    while (!brand) {
      randomBrand = Math.floor(Math.random() * 999950);
      brand = await BrandModel.findOne({brand_id : randomBrand});
    }
    const carData = {
      make: brand.brand,
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


  public async getCars(page: number): Promise<any[]> {
    try {
      const pageSize = 50;
      const skip = page * pageSize;
  
      // Retrieve only the required fields from the database
      const cars = await CarModel.find({}, { _id: 0, id: 1, make: 1, model: 1, year: 1, color: 1 })
                                  .skip(skip)
                                  .limit(pageSize);
  
      // Return the retrieved documents
      return cars;
    } catch (error) {
      console.error('Error getting cars:', error);
      return [];
    }
  }
  
}