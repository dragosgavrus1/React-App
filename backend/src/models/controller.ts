import { Request, Response } from 'express';
import  Car from './car';
import { faker } from '@faker-js/faker';


export class CarList {

    id: number = 1;
    cars: Car[] = [
    ];

    public initalizeCars(): void {
      for (let i = 0; i < 20; i++) {
        this.generateCar();
      }
    }

    public addCar(car: any): Car {
        let carToAdd = new Car(this.id, car.make, car.model, car.year, car.color);
        this.cars.push(carToAdd);
        this.id++;
        return carToAdd;
    }

    public generateCar(): Car {
        const car = {
          make: faker.vehicle.manufacturer(),
          model: faker.vehicle.model(),
          year: faker.date.past().getFullYear(),
          color: faker.vehicle.color(),
        };
        return this.addCar(car);
      }
}