import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect, test} from 'vitest';
import LoginPage from '../pages/LoginPage/LoginPage';

test('test displays CarListPage render', () => {
    render(
        <BrowserRouter>
            <LoginPage></LoginPage>
        </BrowserRouter>
    );

    const linkElement = screen.getByTestId('login-form');
    expect(linkElement).toBeInTheDocument();
    const loginButton = screen.getByTestId('login-button');
    expect(loginButton).toBeInTheDocument();
    
});
