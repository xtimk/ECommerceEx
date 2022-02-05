import { Add, Delete, Remove } from "@mui/icons-material"
import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { useState } from "react";
import { Link } from "react-router-dom";
import agent from "../../app/api/agent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync, setBasket } from "./basketSlice";
import BasketSummary from "./BasketSummary";

export default function BasketPage() {

    // const {basket, setBasket, removeItem} = useStoreContext();

    const {basket, status} = useAppSelector(state => state.basket);

    const dispatch = useAppDispatch();

    // const [loading, setLoading] = useState(false);

    
    if(!basket) return <Typography variant='h3'>Your basket is empty</Typography>

    // var subTotal = 0
    // basket.items.map(item => {
    //   subTotal += item.price * item.quantity
    // });

    // var deliveryFee = 500
    // if(subTotal >= 10000) deliveryFee = 0;

    return (
      <>
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right">SubTotal</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {basket.items.map(item => (
              <TableRow
                key={item.productId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Box display='flex' alignItems='center'>
                    <img src={item.pictureUrl} alt={item.name} style={{height: 50, marginRight: 20}} />
                    <span>{item.name}</span>
                  </Box>
                </TableCell>
                <TableCell align="right">${(item.price / 100).toFixed(2)}</TableCell>
                <TableCell align="center">
                  <LoadingButton 
                    // loading={status.includes('pendingRemoveItem' + item.productId)} 
                    loading={status === ('pendingRemoveItem' + item.productId + 'rem')} 
                    onClick={() => dispatch(removeBasketItemAsync({productId: item.productId, quantity: 1, name: 'rem'}))} 
                    color='error'
                  >
                    <Remove />
                  </LoadingButton>
                  {item.quantity}
                  <LoadingButton 
                    loading={status === ('pendingAddItem' + item.productId)} 
                    onClick={() => dispatch(addBasketItemAsync({productId: item.productId, quantity: 1}))} 
                    color='secondary'
                  >
                    <Add />
                  </LoadingButton>
                </TableCell>
                <TableCell align="right">${(item.price * item.quantity / 100).toFixed(2)}</TableCell>
                <TableCell align="right">
                    <LoadingButton 
                      loading={status === ('pendingRemoveItem' + item.productId + 'del')} 
                      onClick={() => dispatch(removeBasketItemAsync({productId: item.productId, quantity: item.quantity, name: 'del'}))}
                      color='error'
                    >
                        <Delete />
                    </LoadingButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container spacing={2} alignContent="right">
        <Grid item xs={8}>
          {/* <BasketSummary /> */}
        </Grid>
        <Grid item xs={4}>
          <BasketSummary />
          <Button
            component={Link}
            to='/checkout'
            variant='contained'
            size='large'
            fullWidth
          >
            Checkout
          </Button>
        </Grid>
      </Grid>
      </>
    ) 
}