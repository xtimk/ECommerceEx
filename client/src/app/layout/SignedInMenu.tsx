import { Button, Menu, MenuItem } from "@mui/material";
import React from "react";
import { signOut } from "../../features/account/accountSlice";
import { useAppDispatch, useAppSelector } from "../store/configureStore";

export default function SignedInMenu() {
    const dispatch = useAppDispatch()
    const {user} = useAppSelector(state => state.account)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    return (
      <>
        <Button
          color='inherit'
          onClick={handleClick}
          sx={{typography: 'h6'}}
        >
          {user?.email}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>My orders</MenuItem>
          <MenuItem onClick={() => dispatch(signOut())}>Logout</MenuItem>
        </Menu>
      </>
    );
}