import React from 'react';
import Car from '../../models/car';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Link } from '@mui/material';
import './CarEditPage.css';
import { CarsContext } from '../../App';

interface Props {
    setCars: (cars: Car[]) => void;
}

const CarEditPage: React.FC<Props> = ({setCars}) => {
    
    const cars = React.useContext(CarsContext);
    const {id} = useParams();
    const carId = parseInt(id ?? '', 10);
    const navigate = useNavigate();

    if(isNaN(carId)){
        return <div data-testId='car-edit-page-none'>
            <Typography variant='h3'>No car selected</Typography>
            <Link component={RouterLink} to="/">Back to Home</Link>
            </div>
        ;
    }
    const car: Car | undefined = cars.find((car) => car.getId() === carId);

    const [state, setState] = React.useState({
        make: car?.getMake() || '',
        model: car?.getModel() || '',
        year: car?.getYear() || 0,
        color: car?.getColor() || ''
    });

    const sortCars = () =>{
        cars.sort((a, b) => a.getMake().localeCompare(b.getMake()));
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const updatedCars = cars.map((car) => {
            if (car.getId() === carId) {
                return new Car(carId,state.make,state.model,state.year,state.color);
            }
            return car;
        });

        setCars(updatedCars);
        sortCars();
        navigate('/');
    }

    return (
        <div className='car-edit-page' data-testId='car-edit-page'>
            <Typography variant="h3">Edit Car {id}</Typography>
            <form onSubmit={handleSubmit}>
                <div>
                    <TextField type="text" data-testId="make-field" value={state.make} label="Make" onChange={(e) => setState({...state, make: e.target.value})} />
                </div>
                <div>
                    <TextField type="text" value={state.model} label="Model" onChange={(e) => setState({...state, model: e.target.value})} />
                </div>
                <div>
                    <TextField type="number" value={state.year} label="Year" onChange={(e) => setState({...state, year: parseInt(e.target.value)})} />
                </div>
                <div>
                    <TextField type="text" value={state.color} label="Color" onChange={(e) => setState({...state, color: e.target.value})} />
                </div>
                <div>
                    <Button type="submit" data-testId="edit-button">Edit Car</Button>
                </div>
                <RouterLink to="/">
                    <Button>Bact to Home</Button>
                </RouterLink>
            </form>
        </div>
    );
}

export default CarEditPage;