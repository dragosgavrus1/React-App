import React from 'react';
import Car from '../../models/car';
import { Link as RouterLink } from 'react-router-dom';
import './CarListPage.css';
import {  Typography , Link, Table, TableContainer, Paper, TableHead, TableBody, TableRow, TableCell, Button, Dialog} from '@mui/material';
import { DialogActions, DialogContentText, DialogContent, IconButton} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


interface Props {
  cars: Car[];
}

const CarListPage: React.FC<Props> = ({ cars}) => {
    const [selectedCar, setSelectedCar] = React.useState<Car | null>(null);
    const [open, setOpen] = React.useState(false);

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

    const handleDelete = () => {
        if (selectedCar) {
            cars.splice(cars.indexOf(selectedCar), 1);
        }
        setOpen(false);
    }

    return (
        <div className='car-list-page'>
            <Typography variant="h3">List of Cars</Typography>

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
                        {cars.map((car) => (
                            <TableRow key={car.getId()} onClick={() => handleCarClick(car)} selected={selectedCar===car} hover>
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

            <div>
                <Link component={RouterLink} to="/add">
                    <Button className='MuiButton normal-button'>Add Car</Button>
                </Link>
            </div>
            

            {selectedCar && (
                <Link component={RouterLink} to={`/car/${selectedCar.getId()}`}>
                    <Button className='MuiButton normal-button'>View Details</Button>
                </Link>
            )}
        
        </div>
    );
}

export default CarListPage;
