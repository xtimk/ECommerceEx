import { Add, Delete, Remove } from "@mui/icons-material"
import { Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { useState } from "react";
import agent from "../../app/api/agent";
import { useStoreContext } from "../../app/context/StoreContext"
import LoadingComponent from "../../app/layout/LoadingComponent";

export default function BasketPage() {

    // const [loading, setLoading] = useState(true)
    // const [basket, setBasket] = useState<Basket | null>(null)

    // useEffect(() => {
    //     agent.Basket.get()
    //         .then(basket => setBasket(basket))
    //         .catch(error => console.log(error))
    //         .finally(() => setLoading(false))
    // }, [])

    // if (loading) return <LoadingComponent message="Loading basket..."/>

    const {basket, setBasket, removeItem} = useStoreContext();

    const [loading, setLoading] = useState(false);
    function handleAddItem(productId: number) {
      setLoading(true);
      agent.Basket.addItem(productId, 1)
        .then(basket => setBasket(basket))
        .catch(error => console.log(error))
        .finally(() => setLoading(false))
    }

    function handleRemoveItem(productId: number, quantity = 1) {
      setLoading(true);
      agent.Basket.removeItem(productId, quantity)
        .then(() => removeItem(productId, quantity)) // the removeItem function from the useStoreContext
        .catch(error => console.log(error))
        .finally(() => setLoading(false))
    }

    if(loading) return <LoadingComponent message="Adding/removing item..."/>
    
    if(!basket) return <Typography variant='h3'>Your basket is empty</Typography>

    return (
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
                  <IconButton color='error'>
                    <Remove />
                  </IconButton>
                  {item.quantity}
                  <IconButton color='secondary' onClick={() => handleAddItem(item.productId)}>
                    <Add />
                  </IconButton>
                </TableCell>
                <TableCell align="right">${(item.price * item.quantity / 100).toFixed(2)}</TableCell>
                <TableCell align="right">
                    <IconButton color='error'>
                        <Delete />
                    </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    ) 
}