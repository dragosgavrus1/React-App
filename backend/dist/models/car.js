"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Car {
    constructor(id, make, model, year, color) {
        this.id = id;
        this.make = make;
        this.model = model;
        this.year = year;
        this.color = color;
    }
    getId() {
        return this.id;
    }
    getMake() {
        return this.make;
    }
    getModel() {
        return this.model;
    }
    getYear() {
        return this.year;
    }
    getColor() {
        return this.color;
    }
    setMake(make) {
        this.make = make;
    }
    setModel(model) {
        this.model = model;
    }
    setYear(year) {
        this.year = year;
    }
    setColor(color) {
        this.color = color;
    }
}
exports.default = Car;
