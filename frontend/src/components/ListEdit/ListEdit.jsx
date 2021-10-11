import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../utils/hooks/UserContext";
import { Container, Box, TextField, Typography, Button, useMediaQuery } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";
import { useParams, useHistory } from "react-router-dom";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import axios from "axios";

export const ListEdit = () => {

    const { user } = useContext(UserContext);
    const { projectId, listId } = useParams();

    let history = useHistory();

    const [list, setList] = useState({});
    const [listTitle, setListTitle] = useState("");

    const [titleError, setTitleError] = useState(false);
    const [reqLoading, setReqLoading] = useState(false);

    const theme = createTheme();
    const isPhone = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        async function getList(){
            return await axios
            .get(`/project/${projectId}/list/${listId}/`, { headers: JSON.parse(user), })
            .then((res) => {
                console.log(res.data);
                setList(res.data);
                setListTitle(res.data.title);
            })
            .catch((err) => {
                console.log(err);
            });
        }
        getList();
    }, [user]);

    const saveList = async() => {
        if(listTitle.trim() === ""){
            setTitleError(true);
        }
        else {
            setReqLoading(true);
            const data = {
                title: listTitle.trim(),
            }
            return await axios
            .patch(`/project/${projectId}/list/${listId}/`, data, { headers: JSON.parse(user), })
            .then((res) => {
                console.log(res);
                setReqLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }

    return (
        <Container 
            maxWidth="md"
            sx={{
                maxWidth: '90vw',
                borderRadius: 5,
                backgroundColor: "white",
                margin: 'auto',
                height: "fit-content",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                p: 2,
            }}
        >
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    flexWrap: 'wrap', 
                    mb: 2,
                }}
            >
                <Typography variant="h3">
                    Edit list
                </Typography>
                <Button 
                    endIcon={<ExitToAppIcon />}
                    onClick={() => {
                        history.push(`/project/${projectId}`);
                    }}
                >
                    Back to project
                </Button>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', }}>
                <Box sx={{ width: isPhone ? '100%' : '50%', m: 2, }}>
                    <TextField  
                        error={titleError}
                        label="List title" 
                        helperText={titleError ? "A title is required" : ""}
                        value={listTitle}
                        onChange={(e) => {
                            setTitleError(false);
                            setListTitle(e.target.value);
                        }}
                        sx={{ width: '100%', }}
                    />
                </Box>
                <LoadingButton 
                    loading={reqLoading}
                    variant="contained" 
                    color="success" 
                    sx={{ boxShadow: 'none', }}
                    onClick={saveList}
                >
                    Save
                </LoadingButton>
            </Box>
        </Container>
    );
}