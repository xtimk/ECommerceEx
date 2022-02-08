import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, Pagination, Paper, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Fragment, useEffect, useState } from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchFilters, fetchProductsAsync, productSelectors } from "./catalogSlice";
import ProductList from "./ProductList";
import ProductSearch from "./ProductSearch";

const sortOptions = [
  {value: 'name', label: 'Alphabetical'},
  {value: 'priceDesc', label: 'Price - High to low'},
  {value: 'price', label: 'Price - Low to high'},
]

export default function Catalog() {
  // const [products, setProducts] = useState<Product[]>([]);
  const products = useAppSelector(productSelectors.selectAll);
  const {productsLoaded, status, filtersLoaded, brands, types} = useAppSelector(state => state.catalog)
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!productsLoaded) dispatch(fetchProductsAsync());
  }, [productsLoaded, dispatch])

  useEffect(() => {
    if(!filtersLoaded) dispatch(fetchFilters());
  }, [filtersLoaded, dispatch])

  if (status.includes('pending')) return <LoadingComponent message="Loading products..." />
  
  return (
    <Grid container spacing={4}>
      <Grid item xs={3}>
        <Paper sx={{mb: 2}}>
          <ProductSearch />
        </Paper>
        <Paper sx={{mb: 2, p: 2}}>
          <FormControl>
            <RadioGroup>
              {sortOptions.map(({value, label}) => (
                <FormControlLabel value={value} label={label} key={value} control={<Radio />}></FormControlLabel>
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>
        <Paper>
          <FormGroup sx={{mb: 2, p: 2}}>
            {brands.map((brand) => (
              <FormControlLabel control={<Checkbox />} label={brand} key={brand}/>
            ))}
          </FormGroup>
        </Paper>
        <Paper>
          <FormGroup sx={{mb: 2, p: 2}}>
            {types.map((type) => (
              <FormControlLabel control={<Checkbox />} label={type} key={type}/>
            ))}
          </FormGroup>
        </Paper>
      </Grid>
      <Grid item xs={9}>
        <ProductList products={products} />
      </Grid>
      <Grid item xs={3} />
      <Grid item xs={9}>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography>
            Displaying 1-6 of 20 items
          </Typography>
          <Pagination
            color='secondary'
            size='large'
            count={8}
            page={2}
          />
        </Box>
      </Grid>
    </Grid>
  )
}