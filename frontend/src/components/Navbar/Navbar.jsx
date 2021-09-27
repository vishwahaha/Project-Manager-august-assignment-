import React, { useState ,useContext } from "react";

import { Box, AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Avatar } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
//Icons
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import MoreIcon from '@mui/icons-material/MoreVert';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';

import { Link } from "react-router-dom";

import useLogout from "../../utils/hooks/useLogout";
import { UserData } from "../../utils/hooks/UserContext";

export const Navbar = () => {

    const { userData } = useContext(UserData);
    const { logoutUser } = useLogout();

    const headingTheme = createTheme({
        typography: {
          fontFamily: [
            'Glory', 
            'sans-serif',
          ].join(','),
        },
    });

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const logout = () => {
        setAnchorEl(null);
        logoutUser();
        window.location.reload();
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="sticky" sx={{ backgroundColor: '#6956C9' }}>
                <Toolbar>
                <ThemeProvider theme={headingTheme}>
                    <AppRegistrationIcon sx={{ fontSize: 35, mr: 2, }} />
                    <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: 600, }}>
                        Project Manager
                    </Typography>
                </ThemeProvider>
                <Avatar sx={{ bgcolor: '#7d7a7a', mr: 1.5, ml: 1.5, }}>
                    {userData.full_name.split(' ').map((item) => item.charAt(0)).join('').toUpperCase()}
                </Avatar>
                <Typography>
                    {userData.full_name}
                </Typography>
                <IconButton
                    size="large"
                    edge="end"
                    color="inherit"
                    onClick={handleClick}
                >
                    <MoreIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                >
                    <Link to="/home" style={{ all: 'inherit', }}>
                        <MenuItem onClick={handleClose} >
                            <HomeIcon sx={{ mr: 1, }} />Home
                        </MenuItem>
                    </Link>
                    <Link to="/dashboard" style={{ all: 'inherit', }}>
                        <MenuItem onClick={handleClose} >
                            <DashboardIcon sx={{ mr: 1, }} />Dashboard
                        </MenuItem>
                    </Link>
                    <MenuItem type="submit" onClick={logout}> 
                        <LogoutIcon sx={{ mr: 1, }} /> Logout
                    </MenuItem>
                </Menu>

                </Toolbar>
            </AppBar>
        </Box>
    );
};

