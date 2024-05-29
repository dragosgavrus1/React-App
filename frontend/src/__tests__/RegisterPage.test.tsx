import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect, test} from 'vitest';
import RegisterPage from '../pages/RegisterPage/RegisterPage';

test('test displays CarListPage render', () => {
    render(
        <BrowserRouter>
            <RegisterPage></RegisterPage>
        </BrowserRouter>
    );

    const linkElement = screen.getByTestId('register-form');
    expect(linkElement).toBeInTheDocument();
    const loginButton = screen.getByTestId('register-button');
    expect(loginButton).toBeInTheDocument();
    
});
