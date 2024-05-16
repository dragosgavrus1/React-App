import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import './BrandListPage.css';
import {
  Typography,
  Link,
  Table,
  TableContainer,
  Paper,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Dialog,
} from '@mui/material';
import { DialogActions, DialogContentText, DialogContent, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { BrandsContext, ServerStatusContext } from '../../App';
import axios from 'axios';

interface Props{
  setBrands: React.Dispatch<React.SetStateAction<{ brand_id: number; brand: string }[]>>;

}

const BrandListPage: React.FC<Props> = ({setBrands}) => {
  const brandsContext = React.useContext(BrandsContext);
  const isServerOnline = React.useContext(ServerStatusContext);
  const [brandsWithCars, setBrandsWithCars] = useState<{ brand_id: number; brand: string; cars: number }[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<{ brand_id: number; brand: string } | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        // Update the brands with cars count
        const brandsWithCars = await Promise.all(
          brandsContext.slice(page * 50, (page + 1) * 50).map(async (brandData: any) => {
            const carsCount = await fetchCars(brandData.brand_id);
            return { ...brandData, cars: carsCount };
          })
        );
  
        if(page === 0){
          setBrandsWithCars(brandsWithCars);
        }
        else{
          // Filter out brands that are already present in the state
          const newBrands = brandsWithCars.filter(brand => !brandsWithCars.some(existingBrand => existingBrand.brand_id === brand.brand_id));
    
          // Add the fetched new brands to the state
          setBrandsWithCars(prevBrands => [...prevBrands, ...newBrands]);
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
    }, [page]);

  const fetchCars = async (brandId: number) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/brands/${brandId}/cars`);
      const cars = response.data;
      return cars.length;
    } catch (error) {
      console.error('Error fetching cars:', error);
      return 0;
    }
  };

  const loadMoreBrands = async () => {
    setLoading(true);
    const nextPage = page + 1;
  
    try {
      const response = await axios.get(`http://localhost:3000/api/brands?page=${nextPage}`);
      const newb = response.data.map((brandData: any) => ({
        brand_id: brandData.brand_id,
        brand: brandData.brand,
      }));
      setBrands((prevBrands) => [...prevBrands, ...newb]);

      const newBrands = response.data.map((brandData: any) => ({
        brand_id: brandData.brand_id,
        brand: brandData.brand,
        cars: 0, // Initialize cars count as 0
      }));
  
      // Fetch cars count for each brand
      for (const brand of newBrands) {
        const carsCount = await fetchCars(brand.brand_id);
        brand.cars = carsCount;
      }
  
      setBrandsWithCars(prevBrands => [...prevBrands, ...newBrands]);
    } catch (error) {
      console.error('Error fetching next page of brands:', error);
    } finally {
      setLoading(false);
      setPage(nextPage);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteButtonClick = (brand: React.SetStateAction<{ brand_id: number; brand: string } | null>) => {
    setSelectedBrand(brand);
    setOpen(true);
  };

  const handleDelete = async () => {
    try {
      setDialogLoading(true);
      if (selectedBrand) {
        if (isServerOnline) {
          await axios.delete(`http://localhost:3000/api/brands/${selectedBrand.brand_id}`);
        } else {
          const pendingApiCalls = JSON.parse(localStorage.getItem('pendingApiCalls') || '[]');
          pendingApiCalls.push({
            method: 'DELETE',
            url: `http://localhost:3000/api/brands/${selectedBrand.brand_id}`,
          });
          localStorage.setItem('pendingApiCalls', JSON.stringify(pendingApiCalls));
        }
        setBrandsWithCars(prevBrands => prevBrands.filter(brand => brand !== selectedBrand));
      }
      setOpen(false);
    } catch (error) {
      console.error('Error deleting brand:', error);
    } finally {
      setDialogLoading(false);
    }
  };

  return (
    <div className='car-list-page' data-testid='brand-list-page'>
      <Typography variant='h3'>List of Brands</Typography>

      <RouterLink to="/">
        <Button className='normal-button'>Back to Home</Button>
      </RouterLink>
      <div>
        <Link component={RouterLink} to='/brands/add'>
          <Button className='MuiButton normal-button'>Add Brand</Button>
        </Link>
      </div>

      <TableContainer component={Paper}>
        <Table aria-label='sticky table'>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Number of cars</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={2}>Loading...</TableCell>
              </TableRow>
            ) : (
              <>
                {brandsWithCars.map(brand => (
                  <TableRow key={brand.brand_id} hover>
                    <TableCell>{brand.brand}</TableCell>
                    <TableCell>{brand.cars}</TableCell>
                    <TableCell>
                      <Link component={RouterLink} to={`/brands/edit/${brand.brand_id}`}>
                        <EditIcon />
                      </Link>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDeleteButtonClick(brand)} children={<DeleteIcon />} />
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this brand?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button disabled={dialogLoading} onClick={handleDelete}>
            {dialogLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {!loading && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button onClick={loadMoreBrands} className='normal-button'>Load More Brands</Button>
        </div>
      )}
    </div>
  );
};

export default BrandListPage;
