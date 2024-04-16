import React, { useEffect } from 'react';
import Car from '../../models/car';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { Button, TextField, Typography } from '@mui/material';
import './CarEditPage.css';
import { CarsContext } from '../../App';
import axios from 'axios';

interface Props {
    setCars: (cars: Car[]) => void;
}

const CarEditPage: React.FC<Props> = ({setCars}) => {

    const navigate = useNavigate();
    const cars = React.useContext(CarsContext);
    const { id } = useParams<{ id: string }>(); // Get the ID from the URL params
    const [car, setCar] = React.useState<Car | null>(null);
    const [state, setState] = React.useState({
        make: car?.getMake() || '',
        model: car?.getModel() || '',
        year: car?.getYear() || 0,
        color: car?.getColor() || ''
    });

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/${id}`); // Fetch car details from the API
                const responseCar = response.data[0];
                const carData: Car = new Car(responseCar.id, responseCar.make, responseCar.model, responseCar.year, responseCar.color);
                setState({make: carData.getMake(), model: carData.getModel(), year: carData.getYear(), color: carData.getColor()});
                setCar(carData);
            } catch (error) {
                console.error('Error fetching car details:', error);
            }
        };

        fetchCar(); // Call the fetchCar function when the component mounts
    }, [id]); // Include id in the dependency array to re-fetch car details when id changes


    const sortCars = () =>{
        cars.sort((a, b) => a.getMake().localeCompare(b.getMake()));
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await axios.put(`http://localhost:3000/api/${id}`, state);
            
            const updatedCar: Car = new Car(response.data.id, response.data.make, response.data.model, response.data.year, response.data.color);
            setCar(updatedCar);

            // Optionally, update the cars array if needed
            const updatedCars = cars.map(car => car.getId() === updatedCar.getId() ? updatedCar : car);
            setCars(updatedCars);

            sortCars();
            navigate('/');
        }
        catch (error) {
            console.error('Error updating car:', error);
        }
    }

    return (
        <div className='car-edit-page' data-testid='car-edit-page'>
            <Typography variant="h3">Edit Car {id}</Typography>
            <form onSubmit={handleSubmit}>
                <div>
                    <TextField type="text" data-testid="make-field" value={state.make} label="Make" onChange={(e) => setState(prevState => ({...prevState, make: e.target.value}))} />
                </div>
                <div>
                    <TextField type="text" value={state.model} label="Model" onChange={(e) => setState(prevState => ({...prevState, model: e.target.value}))} />
                </div>
                <div>
                    <TextField type="number" value={state.year} label="Year" onChange={(e) => setState(prevState => ({...prevState, year: parseInt(e.target.value)}))} />
                </div>
                <div>
                    <TextField type="text" value={state.color} label="Color" onChange={(e) => setState(prevState => ({...prevState, color: e.target.value}))} />
                </div>
                <div>
                    <Button type="submit" data-testid="edit-button">Edit Car</Button>
                </div>
                <RouterLink to="/">
                    <Button>Bact to Home</Button>
                </RouterLink>
            </form>
        </div>
    );
}

export default CarEditPage;