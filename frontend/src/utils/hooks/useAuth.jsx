import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { UserContext, UserData } from './UserContext';

export default function useAuth(){
    let history = useHistory();
    const { setUser } = useContext(UserContext);
    const { setUserData, setLoading } = useContext(UserData);
    const [error, setError] = useState(null);

    const setUserContext = async () => {
        return await axios
        .get('/check_cookie', {withCredentials: true})
        .then((response) => {
            if (response.status === 200) {
                setUser(JSON.stringify(response.data));
                axios.get('/user_details', { headers: response.data })
                .then((res) => {
                    setUserData(res.data);
                    setLoading(false);
                    history.push('/home');
                });
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
