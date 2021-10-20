import React, { useContext } from 'react';
import { UserContext } from '../../utils/hooks/UserContext';
import { Redirect } from 'react-router';
import { Button } from '@mui/material';
import { Typography, Box } from '@mui/material';

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

    return (
        <Box
            sx={{
                width: 'fit-content',
                position: 'absolute',
                left: '50%',
                top: '40%',
                transform: 'translate(-50%, -50%)',
            }}
        >
            <Typography 
                variant="h1" 
                align="center" 
                color="primary" 
                sx={{ 
                    fontWeight: 900, 
                    fontFamily: [
                        'Glory', 
                        'sans-serif',
                        ].join(','),
                }} 
                gutterBottom
            >
                Sorted
            </Typography>
            <Box>
                <form>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Button 
                            variant="contained" 
                            type="submit" 
                            onClick={handleClick} 
                            disableElevation
                        >
                            Login through channel-i
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    );
}

