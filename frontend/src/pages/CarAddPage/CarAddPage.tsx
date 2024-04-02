import React from 'react';
import Car from '../../models/car';
import { Link as RouterLink } from 'react-router-dom';
import './CarAddPage.css'
import { Button, TextField, Typography } from '@mui/material';
import { CarsContext } from '../../App';

interface Props {
    setCars: (cars: Car[]) => void;
}

const CarAddPage: React.FC<Props> = () => {
    
    const cars = React.useContext(CarsContext);
    const [state, setState] = React.useState({
        make: '',
        model: '',
        year: 0,
        color: ''
    });

    const sortCars = () =>{
        cars.sort((a, b) => a.getMake().localeCompare(b.getMake()));
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newCar = new Car(cars.length+1, state.make, state.model, state.year, state.color);
        cars.push(newCar);
        sortCars();
        if (setState) {
            setState({
                make: '',
                model: '',
                year: 0,
                color: ''
            });
        }
    }

    return (
        <div className='car-add-page' data-testId='car-add-page'>
            <Typography variant="h3">Add a Car</Typography>
            <form onSubmit={handleSubmit}>
                <div>
                    <TextField type="text" value={state.make} label="Make" onChange={(e) => setState({...state, make: e.target.value})} />
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
                    <Button type="submit" data-testId='add-button'>Add Car</Button>
                </div>
                <RouterLink to="/">
                    <Button>Bact to Home</Button>
                </RouterLink>
            </form>
        </div>
    );
}

export default CarAddPage;