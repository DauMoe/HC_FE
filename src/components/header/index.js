import React from 'react';
import {AppBar, Toolbar, IconButton, Typography, Button} from "@material-ui/core";

function Header() {
    return(
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6">
                    H<sup>3</sup>Care
                </Typography>
                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
    );
}

export default Header;