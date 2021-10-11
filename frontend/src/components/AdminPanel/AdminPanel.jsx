import React, { useContext, useState, useEffect } from "react";
import { UserContext, UserData } from "../../utils/hooks/UserContext";
import { UserCard } from "./UserCard";
import { NotAllowed } from "../NotAllowed";
import { Loading } from "../Login/Loading";
import { Container } from "@mui/material";
import axios from "axios";

export const AdminPanel = () => {

    const { user } = useContext(UserContext);
    const { userData } = useContext(UserData);

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);

    const [dataChange, setDataChange] = useState(false);

    useEffect(() => {
        async function getUsers(){
            return await axios
            .get('/user/', { headers: JSON.parse(user) })
            .then((res) => {
                console.log(res);
                setUsers(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            })
        }
        getUsers();
    }, [user, dataChange]);   

    if(userData.user_type !== "admin"){
        return <NotAllowed />
    }
    else{
        if(loading){
            return <Loading />
        }
        else
        return (
            <Container maxWidth="lg">
                {users.map((user, idx) => {
                    if(user.user_id !== userData.user_id)
                        return <UserCard user={user} key={idx} userChange={() => {setDataChange(!dataChange)}} />
                })
                }
            </Container>
        );
    }
}