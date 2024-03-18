import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect, test, vi} from 'vitest';
import Car from '../models/car';
import CarAddPage from '../pages/CarAddPage/CarAddPage';

test('test displays CarListPage render', () => {
    const cars: Car[] = [
        new Car(1, 'Ford', 'Fusion', 2019, 'black'),
        new Car(2, 'Chevy', 'Volt', 2018, 'blue'),
    ];
    
    render(
        <BrowserRouter>
            <CarAddPage cars={cars} setCars={vi.fn()} />
        </BrowserRouter>
    );
    
    // no id is given bc the useParams hook is not being used in the test
    const linkElement = screen.getByTestId('car-add-page');
    const button = screen.getByTestId('add-button');
    fireEvent.click(button);
    expect(linkElement).toBeInTheDocument();
    expect(cars.length).toBe(3);

});
