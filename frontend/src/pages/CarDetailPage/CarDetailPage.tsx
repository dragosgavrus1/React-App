import React, { useContext, useEffect, useState } from 'react';
import Car from '../../models/car';
import { Link as RouterLink, useParams } from 'react-router-dom';
import './CarDetailPage.css';
import { Typography, Link, Button } from '@mui/material';
import axios from 'axios';
import { CarsContext, ServerStatusContext } from '../../App';



const CarDetailPage: React.FC = () => {

    const { id } = useParams<{ id: string }>(); // Get the ID from the URL params
    const [car, setCar] = useState<Car | null>(null); // State to store car data
    const isServerOnline = useContext(ServerStatusContext);
    const cars = useContext(CarsContext);

    useEffect(() => {
        const fetchCar = async () => {
            if (isServerOnline) {
                try {
                    const response = await axios.get(`http://16.170.236.247:3000/api/cars/${id}`); // Fetch car details from the API
                    const responseCar = response.data[0];
                    const carData: Car = new Car(responseCar.id, responseCar.make, responseCar.model, responseCar.year, responseCar.color);
                    setCar(carData);
                } catch (error) {
                    console.error('Error fetching car details:', error);
                }
            }
            else {
                const car = cars.find(car => car.getId() === parseInt(id || '', 10));
                if (car) {
                    setCar(car);
                }
            }
        };

        fetchCar(); // Call the fetchCar function when the component mounts
    }, [id]); // Include id in the dependency array to re-fetch car details when id changes



    return (
        <div className='car-detail-page' data-testid='car-detail-page'>
            <Typography variant='h3'>Car Details</Typography>
            {car && (
                <>
                    <Typography variant='body1' >Make: {car.getMake()}</Typography>
                    <Typography variant='body1' >Model: {car.getModel()}</Typography>
                    <Typography variant='body1' >Year: {car.getYear()}</Typography>
                    <Typography variant='body1' >Color: {car.getColor()}</Typography>
                </>
            )}
            <Link component={RouterLink} to="/" ><Button>Back to Home</Button></Link>
        </div>
    );
}

export default CarDetailPage;