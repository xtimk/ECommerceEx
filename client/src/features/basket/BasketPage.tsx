import { Add, Delete, Remove } from "@mui/icons-material"
import { LoadingButton } from "@mui/lab";
import { Box, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { useState } from "react";
import agent from "../../app/api/agent";
import { useStoreContext } from "../../app/context/StoreContext"
import LoadingComponent from "../../app/layout/LoadingComponent";
import BasketSummary from "./BasketSummary";

export default function BasketPage() {

    const {basket, setBasket, removeItem} = useStoreContext();

    // const [loading, setLoading] = useState(false);

    const [status, setStatus] = useState({
      loading: false,
      name: ''
    });

    function handleAddItem(productId: number, name: string) { // pass name to make progress indicator specific of icon
      setStatus({loading: true, name: name});
      agent.Basket.addItem(productId, 1)
        .then(basket => setBasket(basket))
        .catch(error => console.log(error))
        .finally(() => setStatus({loading: false, name: name}))
    }

    function handleRemoveItem(productId: number, quantity = 1, name: string) {
      setStatus({loading: true, name: name});
      agent.Basket.removeItem(productId, quantity)
        .then(() => removeItem(productId, quantity)) // the removeItem function from the useStoreContext
        .catch(error => console.log(error))
        .finally(() => setStatus({loading: false, name: name}))
    }
    
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
                  <LoadingButton loading={status.loading && status.name === 'rem' + item.productId} onClick={() => handleRemoveItem(item.productId, 1, 'rem' + item.productId)} color='error'>
                    <Remove />
                  </LoadingButton>
                  {item.quantity}
                  <LoadingButton loading={status.loading && status.name === 'add' + item.productId} onClick={() => handleAddItem(item.productId, 'add' + item.productId)} color='secondary'>
                    <Add />
                  </LoadingButton>
                </TableCell>
                <TableCell align="right">${(item.price * item.quantity / 100).toFixed(2)}</TableCell>
                <TableCell align="right">
                    <LoadingButton loading={status.loading && status.name === 'del' + item.productId} onClick={() => handleRemoveItem(item.productId, item.quantity, 'del' + item.productId)} color='error'>
                        <Delete />
                    </LoadingButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid>
        <BasketSummary />
      </Grid>
      </>
    ) 
}