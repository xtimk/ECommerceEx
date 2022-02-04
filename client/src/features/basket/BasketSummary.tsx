import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import { useStoreContext } from "../../app/context/StoreContext";
import { BasketItem } from "../../app/models/basket";

function ccyFormat(num) {
    return `${(num / 100).toFixed(2)}`;
}


export default function BasketSummary() {
    const {basket} = useStoreContext();

    const subTotal = basket?.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) ?? 0; // ?? if the basket is undef return 0

    const deliveryFee = subTotal < 10000 ? 500 : 0;

    return (
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 200 }} aria-label="spanning table">
          <TableHead>
            <TableRow>
              <TableCell align="right" colSpan={1}>
              </TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
            <TableRow>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {/* <TableCell rowSpan={3} colSpan={6}></TableCell> */}
              <TableCell colSpan={1}>Subtotal</TableCell>
              <TableCell align="right">${ccyFormat(subTotal)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={1}>Delivery fee*</TableCell>
              <TableCell align="right">${ccyFormat(deliveryFee)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={1}>Total</TableCell>
              <TableCell align="right">${ccyFormat(subTotal + deliveryFee)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    )
}