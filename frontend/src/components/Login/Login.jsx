import React, { useContext } from 'react';
import { UserContext } from '../../utils/hooks/UserContext';
import { Redirect } from 'react-router';
import { Button } from '@mui/material';
import { Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

export const Login = () => {
    const { user } = useContext(UserContext);

    if(user){
        return <Redirect to='/home'/>
    }

    let auth_params = {
        CLIENT_ID : 'a3GrhfJ9Wc9UAt8ClPhkA817ts3SYRTJo4wljdsp',
        STATE_STRING : 'this_string',
        REDIRECT_URI : 'http://localhost:3000/oauth'
    }
    const handleClick = (e) => {
        e.preventDefault();
        window.location.href = "https://channeli.in/oauth/authorise/?client_id="+auth_params.CLIENT_ID+"&redirect_uri="+auth_params.REDIRECT_URI+"&state="+auth_params.STATE_STRING;
    }

    const headingTheme = createTheme({
        typography: {
          fontFamily: [
            'Glory', 
            'sans-serif',
          ].join(','),
        },
    });

    return (
        <div className="login-page-wrapper">
            <ThemeProvider theme={headingTheme}>
                <Typography variant="h1" align="center" color="#6956C9" sx={{ fontWeight: 900, }} gutterBottom>
                    Project Manager
                </Typography>
            </ThemeProvider>
            <div className="login-form">
                <form>
                <div className="form-item">
                    <Button variant="contained" color="primary" type="submit" onClick={handleClick} disableElevation>
                        Login through channel-i
                    </Button>
                </div>
                </form>
            </div>
        </div>
    );
}

