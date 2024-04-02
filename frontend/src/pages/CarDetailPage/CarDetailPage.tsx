import React, { useEffect, useState } from 'react';
import Car from '../../models/car';
import { Link as RouterLink, useParams } from 'react-router-dom';
import './CarDetailPage.css';
import { Typography, Link, Button } from '@mui/material';
import axios from 'axios';



const CarDetailPage: React.FC = () => {

    const { id } = useParams<{ id: string }>(); // Get the ID from the URL params
    const [car, setCar] = useState<Car | null>(null); // State to store car data

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/${id}`); // Fetch car details from the API
                const carData: Car = new Car(response.data.id, response.data.make, response.data.model, response.data.year, response.data.color);
                setCar(carData);
            } catch (error) {
                console.error('Error fetching car details:', error);
            }
        };

        fetchCar(); // Call the fetchCar function when the component mounts
    }, [id]); // Include id in the dependency array to re-fetch car details when id changes



    return (
        <div className='car-detail-page' data-testId='car-detail-page'>
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