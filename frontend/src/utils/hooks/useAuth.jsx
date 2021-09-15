import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './UserContext';

export default function useAuth(){
    let history = useHistory();
    const { setUser } = useContext(UserContext);
    const [error, setError] = useState(null);

    const setUserContext = async () => {
        return await axios
        .get('/check_cookie', {withCredentials: true})
        .then((response) => {
            if (response.status === 200) {
                setUser(JSON.stringify(response.data));
                history.push('/home');
            } 
            else {
                setUser(null);
            }
        })
        .catch((err) => { 
            setUser(null);
            setError(err);
            console.log(err);
        });
    }

    const loginUser = async(url) => {
        return await axios
        .get('/' + url, {withCredentials: true})
        .then(async(response) => {
            if (response.status === 200){
                await setUserContext();
            }
        })
        .catch((err) => {
            setError(err);
        });
    }

    return {
        loginUser,
        error   
    }
}
