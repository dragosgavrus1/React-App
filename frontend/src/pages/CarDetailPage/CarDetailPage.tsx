import React from 'react';
import Car from '../../models/car';
import { Link as RouterLink, useParams } from 'react-router-dom';
import './CarDetailPage.css';
import { Typography, Link, Button } from '@mui/material';
import { CarsContext } from '../../App';



const CarDetailPage: React.FC = () => {

    const cars = React.useContext(CarsContext);
    const {id} = useParams();
    const carId = parseInt(id ?? '', 10);
    if(isNaN(carId)){
        return <div data-testId='car-detail-page-none'>
            <Typography variant='h3'>No car selected</Typography>
            <Link component={RouterLink} to="/"><Button>Back to Home</Button></Link>
            </div>
        ;
    }

    const car: Car | undefined = cars.find((car) => car.getId() === carId);

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