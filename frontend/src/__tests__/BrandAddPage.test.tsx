import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect, test, vi} from 'vitest';
import BrandAddPage from '../pages/BrandAddPage/BrandAddPage';

test('test displays CarListPage render', () => {
    render(
        <BrowserRouter>
            <BrandAddPage></BrandAddPage>
        </BrowserRouter>
    );

    const linkElement = screen.getByTestId('brand-add-page');
    expect(linkElement).toBeInTheDocument();
    
});
