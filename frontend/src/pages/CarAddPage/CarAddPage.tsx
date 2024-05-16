import React from 'react';
import Car from '../../models/car';
import { Link as RouterLink } from 'react-router-dom';
import './CarAddPage.css'
import { Button, MenuItem, TextField, Typography } from '@mui/material';
import { CarsContext, ServerStatusContext, BrandsContext } from '../../App';
import axios from 'axios';

interface Props {
    setCars: (cars: Car[]) => void;
}

const CarAddPage: React.FC<Props> = () => {
    
    const cars = React.useContext(CarsContext);
    const isServerOnline = React.useContext(ServerStatusContext);
    const brands = React.useContext(BrandsContext);
    const [state, setState] = React.useState({
        make: '',
        model: '',
        year: 0,
        color: ''
    });

    const sortCars = () =>{
        cars.sort((a, b) => a.getMake().localeCompare(b.getMake()));
    }

    const savePendingApiCall = (carData: { make: string; model: string; year: number; color: string; }) => {
        // Retrieve existing pending API calls from localStorage
        const pendingApiCalls = JSON.parse(localStorage.getItem('pendingApiCalls') || '[]');
      
        // Add the new pending API call to the array
        pendingApiCalls.push({
          method: 'POST',
          url: 'http://16.170.236.247:3000/api/cars',
          data: carData
        });
      
        // Save the updated array back to localStorage
        localStorage.setItem('pendingApiCalls', JSON.stringify(pendingApiCalls));
    };
      
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
          if(!(state.make === '' || state.model === '' || state.year === 0 || state.color === '')) {
            console.log(isServerOnline)
            if (!isServerOnline) {
                // Save the API call data to localStorage if the server is offline
                savePendingApiCall(state);
                const newCar = new Car(0, state.make, state.model, state.year, state.color);
                cars.push(newCar);
                sortCars();
                setState({
                    make: '',
                    model: '',
                    year: 0,
                    color: ''
                });
            }
            else {
                const response = await axios.post('http://16.170.236.247:3000/api/cars', state);
                const newCarData = response.data;
                const newCar = new Car(newCarData.id, newCarData.make, newCarData.model, newCarData.year, newCarData.color);
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
          }
        }
        catch (error) {
          console.error('Error adding car:', error);
        }  
    };


    return (
        <div className='car-add-page' data-testid='car-add-page'>
            <Typography variant="h3">Add a Car</Typography>
            <form onSubmit={handleSubmit}>
                <div>
                    <TextField
                        select
                        value={state.make}
                        label="Make"
                        onChange={(e) => setState({ ...state, make: e.target.value })}
                    >
                        {brands.map((brand) => (
                            <MenuItem key={brand.brand_id} value={brand.brand}>
                                {brand.brand}
                            </MenuItem>
                        ))}
                    </TextField>
                </div>
                <div>
                    <TextField
                        type="text"
                        value={state.model}
                        label="Model"
                        onChange={(e) => setState({ ...state, model: e.target.value })}
                    />
                </div>
                <div>
                    <TextField
                        type="number"
                        value={state.year}
                        label="Year"
                        onChange={(e) => setState({ ...state, year: parseInt(e.target.value) })}
                    />
                </div>
                <div>
                    <TextField
                        type="text"
                        value={state.color}
                        label="Color"
                        onChange={(e) => setState({ ...state, color: e.target.value })}
                    />
                </div>
                <div>
                    <Button type="submit" data-testid='add-button'>Add Car</Button>
                </div>
                <RouterLink to="/">
                    <Button>Back to Home</Button>
                </RouterLink>
            </form>
        </div>
    );
}

export default CarAddPage;