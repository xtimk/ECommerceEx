import { Grid, Pagination, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect } from "react";
import AppPagination from "../../app/components/AppPagination";
import CheckboxButtons from "../../app/components/CheckboxButtons";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchFilters, fetchProductsAsync, productSelectors, setPageNumber, setProductParams } from "./catalogSlice";
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
  const {productsLoaded, status, filtersLoaded, brands, types, productParams, metaData} = useAppSelector(state => state.catalog)
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!productsLoaded) dispatch(fetchProductsAsync());
  }, [productsLoaded, dispatch])

  useEffect(() => {
    if(!filtersLoaded) dispatch(fetchFilters());
  }, [filtersLoaded, dispatch])

  // if (status.includes('pending') || !metaData) return <LoadingComponent message="Loading products..." />
  if (!filtersLoaded) return <LoadingComponent message="Loading products..." />

  return (
    <Grid container columnSpacing={4}>
      <Grid item xs={3}>
        <Paper sx={{mb: 2}}>
          <ProductSearch />
        </Paper>
        <Paper sx={{mb: 2, p: 2}}>
          <RadioButtonGroup
            selectedValue={productParams.orderBy}
            options={sortOptions}
            onChange={(e) => dispatch(setProductParams({orderBy: e.target.value}))}
          />
        </Paper>
        <Paper>
          {/* <FormGroup sx={{mb: 2, p: 2}}>
            {brands.map((brand) => (
              <FormControlLabel control={<Checkbox />} label={brand} key={brand}/>
            ))}
          </FormGroup> */}
          <CheckboxButtons 
            items={brands}
            checked={productParams.brands}
            onChange={(items: string[]) => dispatch(setProductParams({brands: items}))}
          />

        </Paper>
        <Paper>
          <CheckboxButtons 
            items={types}
            checked={productParams.types}
            onChange={(items: string[]) => dispatch(setProductParams({types: items}))}
          />
        </Paper>
      </Grid>
      <Grid item xs={9}>
        <ProductList products={products} />
      </Grid>
      <Grid item xs={3} />
      <Grid item xs={9}>
        {/* <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography>
            Displaying 1-6 of 20 items
          </Typography>
          <Pagination
            color='secondary'
            size='large'
            count={metaData?.totalPages}
            page={metaData?.currentPage}
          />
        </Box> */}
        {metaData && 
          <AppPagination
            metaData={metaData}
            onPageChange={(page: number) => dispatch(setPageNumber({pageNumber: page}))}
          />
        }

      </Grid>
    </Grid>
  )
}