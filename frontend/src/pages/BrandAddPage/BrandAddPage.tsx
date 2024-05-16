import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, TextField, Typography } from '@mui/material';
import { BrandsContext, ServerStatusContext } from '../../App';
import './BrandAddPage.css';
import axios from 'axios';

const BrandAddPage: React.FC = () => {
    const brands = React.useContext(BrandsContext);
    const isServerOnline = React.useContext(ServerStatusContext);
    const [brand, setBrand] = React.useState('');

    const savePendingApiCall = (brandName: string) => {
        const pendingApiCalls = JSON.parse(localStorage.getItem('pendingApiCalls') || '[]');
        pendingApiCalls.push({
            method: 'POST',
            url: 'http://16.170.236.247:3000/api/brands',
            data: { brand: brandName }
        });
        localStorage.setItem('pendingApiCalls', JSON.stringify(pendingApiCalls));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (brand.trim() !== '') {
                if (!isServerOnline) {
                    savePendingApiCall(brand);
                    brands.push({ brand_id: 0, brand: brand });
                    setBrand('');
                } else {
                    const response = await axios.post('http://16.170.236.247:3000/api/brands', { brand: brand });
                    response.data.brand_id = response.data.id;
                    brands.push(response.data);

                    setBrand('');
                }
            }
        } catch (error) {
            console.error('Error adding brand:', error);
        }
    };

    return (
        <div className='car-add-page' data-testid='brand-add-page'>
            <Typography variant="h3">Add a Brand</Typography>
            <form onSubmit={handleSubmit}>
                <div>
                    <TextField
                        type="text"
                        value={brand}
                        label="Brand Name"
                        onChange={(e) => setBrand(e.target.value)}
                    />
                </div>
                <div>
                    <Button type="submit">Add Brand</Button>
                </div>
                <RouterLink to="/brands">
                    <Button>Back to Home</Button>
                </RouterLink>
            </form>
        </div>
    );
};

export default BrandAddPage;
