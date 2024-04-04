import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect, test} from 'vitest';
import CarListPage from '../pages/CarListPage/CarListPage';

test('test displays CarListPage render', () => {
    render(
        <BrowserRouter>
            <CarListPage/>
        </BrowserRouter>
    );

    const linkElement = screen.getByTestId('car-list-page');
    expect(linkElement).toBeInTheDocument();
    
});
