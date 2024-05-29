import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect, test, vi} from 'vitest';
import BrandEditPage from '../pages/BrandEditPage/BrandEditPage';

test('test displays BrandEditPage render', () => {
    render(
        <BrowserRouter>
            <BrandEditPage></BrandEditPage>
        </BrowserRouter>
    );

    const linkElement = screen.getByTestId('brand-edit-page');
    expect(linkElement).toBeInTheDocument();
    
});
