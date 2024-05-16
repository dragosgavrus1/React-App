import React, { useEffect } from 'react';
import Car from '../../models/car';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { Button, MenuItem, TextField, Typography } from '@mui/material';
import './CarEditPage.css';
import { BrandsContext, CarsContext, ServerStatusContext } from '../../App';
import axios from 'axios';

interface Props {
    setCars: (cars: Car[]) => void;
}

const CarEditPage: React.FC<Props> = ({setCars}) => {

    const navigate = useNavigate();
    const cars = React.useContext(CarsContext);
    const brands = React.useContext(BrandsContext);
    const isServerOnline = React.useContext(ServerStatusContext);
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
            if(isServerOnline){
                try {
                const response = await axios.get(`http://16.170.236.247:3000/api/cars/${id}`); // Fetch car details from the API
                const responseCar = response.data[0];
                const carData: Car = new Car(responseCar.id, responseCar.make, responseCar.model, responseCar.year, responseCar.color);
                setState({make: carData.getMake(), model: carData.getModel(), year: carData.getYear(), color: carData.getColor()});
                setCar(carData);
                } catch (error) {
                    console.error('Error fetching car details:', error);
                }
            }
            else {
                const car = cars.find(car => car.getId() === parseInt(id ?? ""));
                if (car) {
                    setState({ make: car.getMake(), model: car.getModel(), year: car.getYear(), color: car.getColor() });
                    setCar(car);
                }
            }
            
        };

        fetchCar();
    }, [id]); 


    const sortCars = () =>{
        cars.sort((a, b) => a.getMake().localeCompare(b.getMake()));
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(isServerOnline){
            try {
            const response = await axios.put(`http://16.170.236.247:3000/api/cars/${id}`, state);
            
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
        else{
            const pendingApiCalls = JSON.parse(localStorage.getItem('pendingApiCalls') || '[]');
            pendingApiCalls.push({
                method: 'PUT',
                url: 'http://16.170.236.247/api/cars/' + id,
                data: state
            });
            localStorage.setItem('pendingApiCalls', JSON.stringify(pendingApiCalls));
            const updatedCar: Car = new Car(car?.getId() ?? 0, state.make, state.model, state.year, state.color);
            setCar(updatedCar);

            const updatedCars = cars.map(car => car.getId() === updatedCar.getId() ? updatedCar : car);
            setCars(updatedCars);

            sortCars();
            navigate('/');
        }
        
    }

    return (
        <div className='car-edit-page' data-testid='car-edit-page'>
            <Typography variant="h3">Edit Car {id}</Typography>
            <form onSubmit={handleSubmit}>
                <div>
                    <TextField
                        select
                        value={state.make}
                        data-testid="make-field"
                        label="Make"
                        onChange={(e) => setState(prevState => ({...prevState, make: e.target.value}))}
                    >
                        {brands.map((brand) => (
                            <MenuItem key={brand.brand_id} value={brand.brand}>
                                {brand.brand}
                            </MenuItem>
                        ))}
                    </TextField>
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