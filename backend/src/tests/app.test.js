const request = require('supertest');
const app = require('../index');
const e = require('express');


describe('Test API endpoints', () => {
  let testCarId;
  let testBrandName;

  it('should get all cars', async () => {
    const res = await request(app).get('/api/cars');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array); // Check if response is an array
    expect(res.body.length).toBeGreaterThan(0); // Check if there are cars in the response
  });

  it('should create a new car', async () => {
    const newCar = {
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      color: 'Red'
    };
    const res = await request(app).post('/api/cars').send(newCar);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    testCarId = res.body.id; // Save the ID for later use in other tests
  });

  it('should get a specific car by ID', async () => {
    const res = await request(app).get(`/api/cars/${testCarId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body[0].make).toEqual('Toyota');
    expect(res.body[0].model).toEqual('Camry');
    expect(res.body[0].year).toEqual(2020);
    expect(res.body[0].color).toEqual('Red');
  });

  it('should update a car', async () => {
    const updatedCar = {
      make: 'Toyota',
      model: 'Corolla',
      year: 2021,
      color: 'Blue'
    };
    const res = await request(app).put(`/api/cars/${testCarId}`).send(updatedCar);
    expect(res.statusCode).toEqual(200);
    expect(res.body.make).toEqual('Toyota');
    expect(res.body.model).toEqual('Corolla');
    expect(res.body.year).toEqual(2021);
    expect(res.body.color).toEqual('Blue');
  });

  it('should delete a car', async () => {
    const res = await request(app).delete(`/api/cars/${testCarId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Car deleted successfully');
  });

  it('should return 404 for non-existing car', async () => {
    const nonExistingId = '0';
    const res = await request(app).get(`/api/cars/${nonExistingId}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Car not found');
  });


  it('should get all brands', async () => {
    const res = await request(app).get('/api/brands');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true); // Check if response is an array
    expect(res.body.length).toBeGreaterThan(0); // Check if there are brands in the response
  });

  it('should create a new brand', async () => {
    const newBrand = {
      brand: 'TestBrand',
    };
    const res = await request(app).post('/api/brands').send(newBrand);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('brand');
    testBrandName = res.body.brand; // Save the ID for later use in other tests
  });

  it('should get a specific brand by name', async () => {
    const res = await request(app).get(`/api/brands/${testBrandName}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.brand).toEqual('TestBrand');
  });

  it('should update a brand', async () => {
    const updatedBrand = {
      brand: 'TestBrand1',
    };
    const res = await request(app).put(`/api/brands/${testBrandName}`).send(updatedBrand);
    expect(res.statusCode).toEqual(200);
    expect(res.body.brand).toEqual('TestBrand1');
  });

  it('should delete a brand', async () => {
    const res = await request(app).delete(`/api/brands/${testBrandName}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Brand deleted successfully');
  });

  it('should return 404 for non-existing brand', async () => {
    const nonExistingId = '0';
    const res = await request(app).get(`/api/brands/${nonExistingId}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Brand not found');
  });

  it('should get all cars by a given brand', async () => {
    const res = await request(app).get(`/api/brands/Toyota/cars`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true); // Check if response is an array
  });
});
