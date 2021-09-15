import React, { useContext } from 'react';
import { Button } from '@material-ui/core'
import { UserContext } from '../../utils/hooks/UserContext';
import { Redirect } from 'react-router';


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
        <div className="wrapper">
            <h1>Project Manager</h1>
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

