import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect, test, vi} from 'vitest';
import BrandListPage from '../pages/BrandListPage/BrandListPage';

test('test displays CarListPage render', () => {
    render(
        <BrowserRouter>
            <BrandListPage setBrands={vi.fn()}></BrandListPage>
        </BrowserRouter>
    );

    const linkElement = screen.getByTestId('brand-list-page');
    expect(linkElement).toBeInTheDocument();
    
});
