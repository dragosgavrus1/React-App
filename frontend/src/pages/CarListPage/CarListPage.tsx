import React, { useEffect } from 'react';
import Car from '../../models/car';
import { Link as RouterLink } from 'react-router-dom';
import './CarListPage.css';
import {  Typography , Link, Table, TableContainer, Paper, TableHead, TableBody, TableRow, TableCell, Button, Dialog} from '@mui/material';
import { DialogActions, DialogContentText, DialogContent, IconButton} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { PieChart } from '@mui/x-charts';
import { CarsContext, ServerStatusContext } from '../../App';
import axios from 'axios';

interface Props {
    setCars: React.Dispatch<React.SetStateAction<Car[]>>;
}
    

const CarListPage: React.FC<Props> = ({ setCars }) => {
    const carsContext = React.useContext(CarsContext);
    const isServerOnline = React.useContext(ServerStatusContext);
    const [selectedCar, setSelectedCar] = React.useState<Car | null>(null);
    const [open, setOpen] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const bottomBoundaryRef = React.useRef<HTMLTableRowElement>(null);


    
    useEffect(() => {
        const handleScroll = () => {
            if (
                bottomBoundaryRef.current &&
                bottomBoundaryRef.current.getBoundingClientRect().bottom <= window.innerHeight
            ) {
                loadMoreCars();
            }
        };
    
        // Debounce function to prevent multiple rapid calls
        const debounce = (func: any, delay: number) => {
            let timer: ReturnType<typeof setTimeout>;
            return function (this: any) {
                const context = this;
                const args = arguments;
                clearTimeout(timer);
                timer = setTimeout(() => func.apply(context, args), delay);
            };
        };
    
        const debouncedScrollHandler = debounce(handleScroll, 1000); // Adjust the delay as needed
    
        window.addEventListener('scroll', debouncedScrollHandler);
        return () => window.removeEventListener('scroll', debouncedScrollHandler);
    }, [page]);
    
    const [fetchedCarIds, setFetchedCarIds] = React.useState<number[]>([]);

    const loadMoreCars = async () => {
        try {
            const nextPage = page + 1; // Increment page number for the next page
            const brandName = carsContext[0].getMake();
            // const response = await axios.get(`http://localhost:3000/api/cars?page=${nextPage}`);
            const response = await axios.get(`http://16.170.236.247:3000/api/cars/brand?brand=${brandName}&page=${nextPage}`);

            const newCars = response.data.map((carData: any) => new Car(carData.id, carData.make, carData.model, carData.year, carData.color));

            // Filter out the cars that are already present in the state
            const filteredNewCars = newCars.filter((car: Car) => !fetchedCarIds.includes(car.getId()));

            // Update the state with new cars
            setCars((prevCars) => [...prevCars, ...filteredNewCars]);
            setFetchedCarIds((prevIds) => [...prevIds, ...filteredNewCars.map((car:Car) => car.getId())]);
            // Update the global state of the page number
            setPage(nextPage);
        } catch (error) {
          console.error('Error fetching next page of cars:', error);
        }
    };
      

    const handleCarClick = (car: Car) => {
        setSelectedCar(car);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleDeleteButtonClick = (car: Car) => {
        setSelectedCar(car);
        setOpen(true);
    }

    const handleDelete = async () => {
        try {
            if (selectedCar) {
                if(isServerOnline){
                    // Make a DELETE request to the backend API to delete the selected car
                    await axios.delete(`http://16.170.236.247:3000/api/cars/${selectedCar.getId()}`);
                }
                else{
                    const pendingApiCalls = JSON.parse(localStorage.getItem('pendingApiCalls') || '[]');
      
                    // Add the new pending API call to the array
                    pendingApiCalls.push({
                    method: 'DELETE',
                    url: 'http://16.170.236.247:3000/api/cars/' + selectedCar.getId(),
                    });
                
                    // Save the updated array back to localStorage
                    localStorage.setItem('pendingApiCalls', JSON.stringify(pendingApiCalls));
                }
                
                carsContext.splice(carsContext.indexOf(selectedCar), 1);
            }
            setOpen(false);
        } catch (error) {
            console.error('Error deleting car:', error);
        }
    }

    const sortCars = () =>{
        carsContext.sort((a, b) => a.getMake().localeCompare(b.getMake()));
    }
    sortCars();

    const chartData = carsContext.reduce((acc: { [key: string]: number }, car) => {
        const make = car.getMake();
        if (acc[make]) {
            acc[make] += 1;
        } else {
            acc[make] = 1;
        }
        return acc;
    }, {});
    
    const pieChartData = Object.keys(chartData).map((make) => ({
        id: make,
        label: make,
        value: chartData[make],
    }));

    return (
        <div className='car-list-page' data-testid='car-list-page'>
            <Typography variant="h3">List of Cars</Typography>

            <div>
                <Link component={RouterLink} to="/brands">
                    <Button className='MuiButton normal-button'>View Brands</Button>
                </Link>
            </div>

            <div>
                <Link component={RouterLink} to="/login">
                    <Button className='MuiButton normal-button'>Profile</Button>
                </Link>
            </div>

            <div>
                <Link component={RouterLink} to="/add">
                    <Button className='MuiButton normal-button'>Add Car</Button>
                </Link>
            </div>


            <PieChart 
                    series={[
                        {
                        data: pieChartData,
                        },
                    ]} width={300} 
                    height={200}
                    slotProps={{
                        legend: {
                            hidden: true,
                        },
                    }}
            />
            
            {selectedCar && (
                <Link component={RouterLink} to={`/car/${selectedCar.getId()}`}>
                    <Button className='MuiButton normal-button'>View Details</Button>
                </Link>
            )}

            <TableContainer component={Paper}>
                <Table aria-label="sticky table">

                    <TableHead>
                        <TableRow>
                            <TableCell>Make</TableCell>
                            <TableCell>Model</TableCell>
                            <TableCell>Year</TableCell>
                            <TableCell>Color</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {carsContext.map((car,index) => (
                            <TableRow key={car.getId()} onClick={() => handleCarClick(car)} selected={selectedCar===car} hover
                            ref={index === carsContext.length - 1 ? bottomBoundaryRef : null}>
                                <TableCell>{car.getMake()}</TableCell>
                                <TableCell>{car.getModel()}</TableCell>
                                <TableCell>{car.getYear()}</TableCell>
                                <TableCell>{car.getColor()}</TableCell>
                                <TableCell>
                                    <Link component={RouterLink} to={`/edit/${car.getId()}`}>
                                        <EditIcon/>
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleDeleteButtonClick(car)} children={<DeleteIcon/>}/>
                                </TableCell>
                            </TableRow>)
                        )}
                    </TableBody>
                    
                    =
                </Table>
            </TableContainer>

            
            
            
            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this car?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleDelete}>Delete</Button>
                </DialogActions>
            </Dialog>

            
        
        </div>
    );
}

export default CarListPage;
