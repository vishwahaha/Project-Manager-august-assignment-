import React, { useState ,useContext } from "react";

import { Box, AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Avatar } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
//Icons
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import MoreIcon from '@mui/icons-material/MoreVert';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';

import { Link, useHistory } from "react-router-dom";

import useLogout from "../../utils/hooks/useLogout";
import { UserData } from "../../utils/hooks/UserContext";

export const Navbar = () => {

    const { userData } = useContext(UserData);
    const { logoutUser } = useLogout();
    let history = useHistory();

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
    const takeHome = () => {
        history.push('/home');
    }

    return (
            <AppBar position="sticky" sx={{ backgroundColor: '#6956C9', }}>
    
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between',}}>
                    <Box onClick={takeHome} sx={{ display: 'flex', cursor: 'pointer', alignItems: 'center', ml: 4, }}>
                        <ThemeProvider theme={headingTheme}>
                            <AppRegistrationIcon sx={{ fontSize: 35, mr: 2, }} />
                            <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: 600, }}>
                                Project Manager
                            </Typography>
                        </ThemeProvider>
                    </Box>
                   
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 4,}}>
                        {userData.display_picture === null ?
                        (
                            <Avatar sx={{ bgcolor: '#7d7a7a', mr: 1.5, ml: 1.5, }} >
                                {userData.full_name.split(' ').map((item) => item.charAt(0)).join('').toUpperCase()}
                            </Avatar> 
                        ) : (
                            <Avatar sx={{ mr: 1.5, ml: 1.5, }} src={userData.display_picture}/>
                        )
                        }
                        <Typography>
                            {userData.full_name}
                        </Typography>
                        <Box>
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
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
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
                        </Box>
                    </Box>
                </Box>
            </AppBar>
    );
};

