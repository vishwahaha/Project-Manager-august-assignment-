import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../utils/hooks/UserContext";
import { Loading } from "../Login/Loading";
import { Container, Box, Typography, Switch, Divider, Backdrop, CircularProgress } from "@mui/material";
import axios from 'axios';

export const Settings = () => {

    const { user } = useContext(UserContext);

    const [pageLoading, setPageLoading] = useState(true);
    const [reqLoading, setReqLoading] = useState(false);
    const [postError, setPostError] = useState(false);
    const [change, setChange] = useState(false);

    const [data, setData] = useState({});
    console.log(user)

    useEffect(() => {
        async function getSettings(){
            return await axios
            .get(`/settings/`, { headers: JSON.parse(user), })
            .then((res) => {
                setData(res.data);
                setPageLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
        }
        getSettings();
    }, [user, change]);

    async function handleSettingChange(value, name){
        const data = {
            [name]: value,
        };
        setReqLoading(true);
        return await axios
        .patch(`/settings/`, data, { headers: JSON.parse(user), })
        .then((res) => {
            if(res.status === 200){
                setPostError(false);
                setReqLoading(false);
                setChange(!change);
            }
        })
        .catch((err) => {
            setPostError(true);
            setReqLoading(false);
        });
    }

    if(pageLoading){
        return <Loading />
    }

    else
    return (
        <Container maxWidth="md" sx={{ mt: 2, }}>

            <Backdrop
                sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={reqLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Typography variant="h3" mb={2}>
                Settings
            </Typography>
            <Box>
                <Typography variant="h4" mb={1}>
                    Email settings
                </Typography>
                <Box
                    sx={{ 
                        backgroundColor: 'white',
                        borderRadius: 5,
                        p: 1,
                        pl: 2,
                        pr: 2,
                    }}
                >

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, }}>
                        <Typography>
                            Email me if I'm added to a project
                        </Typography>
                        <Switch
                            checked={data.email_on_project_add}
                            onChange={e => handleSettingChange(e.target.checked, 'email_on_project_add')}
                        />
                    </Box>

                    <Divider />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, }}>
                        <Typography>
                            Email me if a card is assigned
                        </Typography>
                        <Switch
                            checked={data.email_on_card_assignment}
                            onChange={e => handleSettingChange(e.target.checked, 'email_on_card_assignment')} 
                        />
                    </Box>

                    <Divider />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, }}>
                        <Typography>
                            Email me if I'm disabled
                        </Typography>
                        <Switch
                            checked={data.email_on_disable}
                            onChange={e => handleSettingChange(e.target.checked, 'email_on_disable')} 
                        />
                    </Box>

                </Box>
            </Box>
            {postError &&
            <Typography color="error">
                Some error occurred.
            </Typography>
            }
        </Container>
    );
}