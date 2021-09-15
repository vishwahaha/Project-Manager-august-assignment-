import React, { useEffect } from 'react';
import useAuth from '../../utils/hooks/useAuth';
import { Loading } from './Loading';


export const OAuth = () => {
    const { loginUser, error } = useAuth();
    let url = window.location.href.split('/').at(-1);
    useEffect(() => {
        const handleOauth = async(url) => {
            await loginUser(url);
        }
        handleOauth(url);
    }, []);
     
    return <Loading />
}