import { LoadingButton } from "@mui/lab";
import { Button, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync } from "../basket/basketSlice";
import { fetchProductAsync, productSelectors } from "./catalogSlice";

export default function ProductDetails() {
    const {basket, status} = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();

    const {id} = useParams<{id: string}>();
    const product = useAppSelector(state => productSelectors.selectById(state, id));
    const {status: productStatus} = useAppSelector(state => state.catalog)
    const [quantity, setQuantity] = useState(0); // store the quantity in stock in a local state

    const item = basket?.items.find(i => i.productId === product?.id);

    useEffect(() => {
        if(item) setQuantity(item.quantity);
        if(!product) dispatch(fetchProductAsync(parseInt(id))) // only call api once, if i dont have product into redux state
    }, [id, item, dispatch, product])

    function handleTextQuantityChange(event: any) {
        if(event.target.value >= 0)
            setQuantity(parseInt(event.target.value));
    }

    function handleUpdateCart() {
        if(!item || quantity > item.quantity) {
            const updatedQuantity = item ? quantity - item.quantity : quantity
            dispatch(addBasketItemAsync({productId: product?.id!, quantity: updatedQuantity}))
        }
        else {
            const updatedQuantity = item ? item.quantity - quantity : quantity
            dispatch(removeBasketItemAsync({productId: product?.id!, quantity: updatedQuantity}));
        }
    }


    if (productStatus.includes('pending')) return <LoadingComponent message='Loading product details...' />

    if (!product) return <NotFound />

    return (
        <Typography variant='h2'>
            <Grid container spacing={6}>
                <Grid item xs={6}>
                    <img src={product.pictureUrl} alt={product.name} style={{width: '100%'}} />
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h3">
                        {product.name}
                    </Typography>
                    <Divider sx={{mb: 2}} />
                    <Typography variant="h4" color='secondary'>
                        ${(product.price / 100).toFixed(2)}
                    </Typography>

                    <TableContainer>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Description</TableCell>
                                    <TableCell>{product.description}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Type</TableCell>
                                    <TableCell>{product.type}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Brand</TableCell>
                                    <TableCell>{product.brand}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Quantity in stock</TableCell>
                                    <TableCell>{product.quantityInStock}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField 
                                onChange={handleTextQuantityChange}
                                variant='outlined'
                                type='number'
                                label='Quantity in Cart'
                                fullWidth
                                value={quantity}
                                sx={{marginTop: '13px'}}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <LoadingButton
                                disabled={(item?.quantity === quantity) || (!item && quantity === 0)}
                                sx={{height: '55px'}}
                                color='primary'
                                size='large'
                                variant='contained'
                                fullWidth
                                onClick={handleUpdateCart}
                                loading={status.includes('pending')}
                            >
                                {item ? 'Update Quantity' : 'Add to Cart'}
                            </LoadingButton>
                        </Grid>
                    </Grid>
                    <Button component={Link} to ='/catalog' >Go back to store</Button>
                </Grid>
            </Grid>
            
        </Typography>
    )
}