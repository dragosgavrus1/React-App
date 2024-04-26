import React, { useEffect } from 'react';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { Button, TextField, Typography } from '@mui/material';
import { BrandsContext, ServerStatusContext } from '../../App';
import "./BrandEditPage.css";
import axios from 'axios';

const BrandEditPage: React.FC = () => {
    const navigate = useNavigate();
    const brands = React.useContext(BrandsContext);
    const isServerOnline = React.useContext(ServerStatusContext);
    const { id } = useParams<{ id: string }>(); // Get the ID from the URL params
    const [brand, setBrand] = React.useState<string>('');
    const [loading, setLoading] = React.useState<boolean>(true);

    useEffect(() => {
        const fetchBrand = async () => {
            try {
                if (isServerOnline) {
                    const response = await axios.get(`http://localhost:3000/api/brands/${id}`);
                    setBrand(response.data.brand);
                } else {
                    const storedBrands = JSON.parse(localStorage.getItem('pendingApiCalls') || '[]');
                    const brandData = storedBrands.find((call: any) => call.url === `http://localhost:3000/api/brands/${id}`);
                    if (brandData) {
                        setBrand(brandData.data.brand);
                    }
                }
            } catch (error) {
                console.error('Error fetching brand details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBrand();
    }, [id, isServerOnline]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (brand.trim() !== '') {
                if (isServerOnline) {
                    await axios.put(`http://localhost:3000/api/brands/${id}`, { brand });
                } else {
                    const pendingApiCalls = JSON.parse(localStorage.getItem('pendingApiCalls') || '[]');
                    pendingApiCalls.push({
                        method: 'PUT',
                        url: `http://localhost:3000/api/brands/${id}`,
                        data: { brand }
                    });
                    localStorage.setItem('pendingApiCalls', JSON.stringify(pendingApiCalls));
                }
                navigate('/');
            }
        } catch (error) {
            console.error('Error updating brand:', error);
        }
    };

    if (loading) {
        return <Typography variant="h3">Loading...</Typography>;
    }

    return (
        <div className='car-edit-page' data-testid='brand-edit-page'>
            <Typography variant="h3">Edit Brand {id}</Typography>
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
                    <Button type="submit">Edit Brand</Button>
                </div>
                <RouterLink to="/brands">
                    <Button>Back to Home</Button>
                </RouterLink>
            </form>
        </div>
    );
};

export default BrandEditPage;
