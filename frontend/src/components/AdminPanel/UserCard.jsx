import React, { useState, useContext } from "react";
import {
    Box,
    Avatar,
    Typography,
    Backdrop,
    Select,
    Chip,
    FormControl,
    InputLabel,
    OutlinedInput,
    MenuItem,
    FormControlLabel,
    Switch,
    CircularProgress,
    useTheme,
} from "@mui/material";
import axios from "axios";
import { UserContext } from "../../utils/hooks/UserContext";
import { StrAvatar } from "../../utils/StrAvatar";

export const UserCard = (props) => {

    const { user } = useContext(UserContext);

    const [loading, setLoading] = useState(false);
    const [adminErr, setAdminErr] = useState(false);

    const theme = useTheme();

    const handleChange = async(event) => {
        setAdminErr(false);
        setLoading(true);
        const {
            target: { value },
        } = event;
        const data = {
            user_type: value,
        }
        return await axios
        .patch(`/user/${props.user.user_id}/`, data, { headers: JSON.parse(user), })
        .then((res) => {
            props.userChange();
            setLoading(false);
        })
        .catch((err) => {
            if(err.response){
                if(err.response.data.message === 'Disabled users cannot be admin'){
                    props.userChange();
                    setLoading(false);
                    setAdminErr(true);
                }
            }
        });
    };

    const changeDisable = async(e) => {
        setAdminErr(false);
        setLoading(true);
        const data = {
            is_disabled: e.target.checked,
        }
        return await axios
        .patch(`/user/${props.user.user_id}/`, data, { headers: JSON.parse(user), })
        .then((res) => {
            props.userChange();
            setLoading(false);
        })  
        .catch((err) => {   
            console.log(err);
        });
    }

    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: 3,
                mt: 1.5,
                mb: 1.5,
                p: 1,
            }}
        >
            <Backdrop
                sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    justifyContent: "space-between",
                    flexWrap: 'wrap',
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <StrAvatar data={props.user} sx={{ ml: 1.5, mr: 1.5 }} />
                    <Box>
                        <Typography color="text.primary" variant="body1">
                            {props.user.full_name}
                        </Typography>
                        <Typography color="text.primary" variant="caption">
                            {props.user.enrolment_number}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', }}>
                    <FormControl sx={{ m: 1 }}>
                        <InputLabel id="user-chip-label">User type</InputLabel>
                        <Select
                            labelId="user-chip-label"
                            id="user-type-select"
                            value={props.user.user_type}
                            onChange={handleChange}
                            input={
                                <OutlinedInput
                                    size="small"
                                    label="User type"
                                />
                            }
                            renderValue={(selected) => (
                                selected === "admin" ? 
                                <Chip label={selected} color="error" />
                                :
                                <Chip label={selected} />
                            )}
                        >
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="normal">Normal</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControlLabel
                        control={<Switch color="warning" checked={props.user.is_disabled} onChange={(e) => changeDisable(e)} />}
                        label="Disabled?"
                        labelPlacement="start"
                        sx={{ color: theme.palette.text.primary, }}
                    />
                </Box>
            </Box>
            {adminErr &&
            <Typography color="error" variant="body2" align="center">
                Disabled users cannot be admin.
            </Typography>
            }
        </Box>
    );
};
