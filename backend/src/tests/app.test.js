const request = require('supertest');
const app = require('../index');

describe('Test API endpoints', () => {
  let testCarId;

  it('should get all cars', async () => {
    const res = await request(app).get('/api');
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
    const res = await request(app).post('/api').send(newCar);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id');
    testCarId = res.body.id; // Save the ID for later use in other tests
  });

  it('should get a specific car by ID', async () => {
    const res = await request(app).get(`/api/${testCarId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.make).toEqual('Toyota');
    expect(res.body.model).toEqual('Camry');
    expect(res.body.year).toEqual(2020);
    expect(res.body.color).toEqual('Red');
  });

  it('should update a car', async () => {
    const updatedCar = {
      make: 'Toyota',
      model: 'Corolla',
      year: 2021,
      color: 'Blue'
    };
    const res = await request(app).put(`/api/${testCarId}`).send(updatedCar);
    expect(res.statusCode).toEqual(200);
    expect(res.body.make).toEqual('Toyota');
    expect(res.body.model).toEqual('Corolla');
    expect(res.body.year).toEqual(2021);
    expect(res.body.color).toEqual('Blue');
  });

  it('should delete a car', async () => {
    const res = await request(app).delete(`/api/${testCarId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.make).toEqual('Toyota');
    expect(res.body.model).toEqual('Corolla');
    expect(res.body.year).toEqual(2021);
    expect(res.body.color).toEqual('Blue');
  });

  it('should return 404 for non-existing car', async () => {
    const nonExistingId = '123';
    const res = await request(app).get(`/api/${nonExistingId}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Car not found');
  });
});
