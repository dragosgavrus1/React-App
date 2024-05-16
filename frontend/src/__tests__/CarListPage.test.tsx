import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect, test} from 'vitest';

test('test displays CarListPage render', () => {
    render(
        <BrowserRouter>
        </BrowserRouter>
    );

    const linkElement = screen.getByTestId('car-list-page');
    expect(linkElement).toBeInTheDocument();
    
});
