import { LoadingButton } from "@mui/lab";
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Product } from "../../app/models/product";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync } from "../basket/basketSlice";

interface Props {
    product: Product;
}

export default function ProductCard({product}: Props) {

  // const [loading, setLoading] = useState(false);
  const {status} = useAppSelector(state => state.basket);

  // const {setBasket} = useStoreContext();
  const dispatch = useAppDispatch();

  // function handleAddItem(productId: number)
  // {
  //   setLoading(true);
  //   agent.Basket.addItem(productId)
  //     .then(basket => dispatch(setBasket(basket)))
  //     .catch(error => console.log(error))
  //     .finally(() => setLoading(false))
  // }

  return (
      <Card>
          <CardHeader avatar={
              <Avatar sx={{bgcolor: 'secondary.main'}}>
                  {product.name.charAt(0).toUpperCase()}
              </Avatar>
          }
          title={product.name}
          titleTypographyProps={{
              sx: {fontWeight: 'bold', color: 'primary.main'}
          }}
          />

      <CardMedia
        sx={{ height: 140, backgroundSize: 'contain', bgcolor: 'primary.light' }}
        image={product.pictureUrl}
        title={product.name}
      />
      <CardContent>
        <Typography gutterBottom color='secondary' variant="h5" component="div">
          ${(product.price / 100).toFixed(2)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
            {product.brand} / {product.type}
        </Typography>
      </CardContent>
      <CardActions>
        <LoadingButton 
          size="small"
          onClick={() => dispatch(addBasketItemAsync({
            productId: product.id,
            quantity: 1
          }))}
          loading={status == 'pendingAddItem' + product.id}
          variant="outlined" >
            Add to cart
      </LoadingButton>
        <Button component={Link} to={`/catalog/${product.id}`} size="small">View</Button>
      </CardActions>
    </Card>
  )
}