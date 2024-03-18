import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect, test} from 'vitest';
import CarListPage from '../pages/CarListPage/CarListPage';
import Car from '../models/car';

test('test displays CarListPage render', () => {
    const cars: Car[] = [
        new Car(1, 'Ford', 'Fusion', 2019, 'black'),
        new Car(2, 'Chevy', 'Volt', 2018, 'blue'),
    ];
    render(
        <BrowserRouter>
            <CarListPage cars={cars} />
        </BrowserRouter>
    );

    const linkElement = screen.getByTestId('car-list-page');
    expect(linkElement).toBeInTheDocument();

});
