import '@testing-library/jest-dom';
import {  render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CarEditPage from '../pages/CarEditPage/CarEditPage';
import {test, expect,vi} from 'vitest';

test('test displays CarEditPage render', () => {

    vi.mock('react-router-dom', async () => {
        const mod = await vi.importActual('react-router-dom');
        return {
          ...mod,
          useParams: () => ({
            id: "1",
          }),
        };
    });
    
    const setCars = vi.fn();

    render(
        <BrowserRouter>
            <CarEditPage setCars={setCars} />
        </BrowserRouter>
    );

    const buttonElement = screen.getByTestId('edit-button');
    const data = screen.getByTestId('make-field');
    
    expect(buttonElement).toBeInTheDocument();
    expect(data).toBeInTheDocument();
    
        
});