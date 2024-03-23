import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Car from '../models/car';
import CarEditPage from '../pages/CarEditPage/CarEditPage';
import {test, expect,vi} from 'vitest';
import userEvent from '@testing-library/user-event';

test('test displays CarEditPage render', () => {
    const cars: Car[] = [
        new Car(123, 'Ford', 'Fusion', 2019, 'black'),
        new Car(2, 'Chevy', 'Volt', 2018, 'blue'),
    ];

    vi.mock('react-router-dom', async () => {
        const mod = await vi.importActual('react-router-dom');
        return {
          ...mod,
          useParams: () => ({
            id: "123",
          }),
        };
    });
    
    const setCars = vi.fn();

    render(
        <BrowserRouter>
            <CarEditPage cars={cars} setCars={setCars} />
        </BrowserRouter>
    );

    const buttonElement = screen.getByTestId('edit-button');
    const data = screen.getByTestId('make-field');
    //fireEvent.change(data, { target: { value: 'Toyota' } });
    userEvent.type(data, 'Toyota');
    fireEvent.click(buttonElement);
    
    expect(buttonElement).toBeInTheDocument();
    expect(data).toBeInTheDocument();
    
    
    expect(setCars).toHaveBeenCalledTimes(1);
    
});