import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect, test, vi} from 'vitest';
import CarAddPage from '../pages/CarAddPage/CarAddPage';

test('test displays CarListPage render', () => {
    
    render(
        <BrowserRouter>
            <CarAddPage setCars={vi.fn()} />
        </BrowserRouter>
    );
    
    // no id is given bc the useParams hook is not being used in the test
    const linkElement = screen.getByTestId('car-add-page');
    const button = screen.getByTestId('add-button');
    expect(linkElement).toBeInTheDocument();
    expect(button).toBeInTheDocument();

});
