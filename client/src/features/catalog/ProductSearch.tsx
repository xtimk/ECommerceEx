import { debounce, TextField } from "@mui/material";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setProductParams } from "./catalogSlice";

export default function ProductSearch() {

    const {productParams} = useAppSelector(state => state.catalog);
    const [searchTerm, setSearchTerm] = useState(productParams.searchTerm);
    const dispatch = useAppDispatch();

    const debouncedSearch = debounce((event: any) => {
        dispatch(setProductParams({searchTerm: event.target.value}))
    }, 1000) // wait 1 sec before starting search

    return (
        <TextField 
        label='Search products'
        variant='outlined'
        fullWidth
        value={searchTerm || ''}
        onChange={(event: any) => {
            setSearchTerm(event.target.value); // let the user see what it is typing
            debouncedSearch(event); // send search after 1 sec
        }}
      />
    )
}