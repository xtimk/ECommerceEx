import { AppBar, FormControlLabel, Switch, Toolbar, Typography } from "@mui/material";

interface Props {
    darkMode: boolean;
    handleThemeChange: () => void;
}

export default function Header ({darkMode, handleThemeChange}: Props) {
    return (
        <AppBar position='static' sx={{mb: 4}}>
            <Toolbar>
                <Typography variant='h6'>
                    ECommerce Re-Store
                </Typography>
                <FormControlLabel checked={darkMode} onChange={handleThemeChange} sx={{ml: 4}} control={<Switch />} label="Dark mode" />
            </Toolbar>
        </AppBar>
    )
}