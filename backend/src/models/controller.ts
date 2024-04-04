import { Request, Response } from 'express';
import  Car from './car';


export class CarList {

    id: number = 21;
    cars: Car[] = [
            new Car(1, "Toyota", "Corolla", 2022, "Blue"),
            new Car(2, "Honda", "Civic", 2021, "Red"),
            new Car(3, "Ford", "Mustang", 2023, "Yellow"),
            new Car(4, "Chevrolet", "Camaro", 2020, "Black"),
            new Car(5, "Toyota", "Camry", 2024, "Silver"),
            new Car(6, "BMW", "3 Series", 2023, "Silver"),
            new Car(7, "Audi", "A4", 2022, "Gray"),
            new Car(8, "Mercedes-Benz", "E-Class", 2023, "Black"),
            new Car(9, "Volkswagen", "Golf", 2022, "Green"),
            new Car(10, "Subaru", "Outback", 2021, "Blue"),
            new Car(11, "Lexus", "RX", 2024, "Red"),
            new Car(12, "Mazda", "CX-5", 2023, "Black"),
            new Car(13, "Honda", "Accord", 2024, "White"),
            new Car(14, "Kia", "Sorento", 2023, "Silver"),
            new Car(15, "Toyota", "Prius", 2023, "Green"),
            new Car(16, "Chevrolet", "Equinox", 2022, "Black"),
            new Car(17, "Honda", "Pilot", 2023, "Blue"),
            new Car(18, "Ford", "Fusion", 2022, "Gray"),
            new Car(19, "Tesla", "Model 3", 2023, "Red"),
            new Car(20, "Nissan", "Altima", 2022, "White")
    ];

    public addCar(car: any): Car {
        let carToAdd = new Car(this.id, car.make, car.model, car.year, car.color);
        this.cars.push(carToAdd);
        this.id++;
        return carToAdd;
    }
}