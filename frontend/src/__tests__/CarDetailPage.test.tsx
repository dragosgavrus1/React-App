import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect, test, vi} from 'vitest';
import CarDetailPage from '../pages/CarDetailPage/CarDetailPage';

test('test displays CarListPage render', () => {
    
    vi.mock('react-router-dom', async () => {
        const mod = await vi.importActual('react-router-dom');
        return {
          ...mod,
          useParams: () => ({
            id: "1",
          }),
        };
    });

    render(
        <BrowserRouter>
            <CarDetailPage />
        </BrowserRouter>
    );
    
    // no id is given bc the useParams hook is not being used in the test
    const linkElement = screen.getByTestId('car-detail-page');
    expect(linkElement).toBeInTheDocument();

});
