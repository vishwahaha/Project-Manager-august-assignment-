import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Loading } from "../Login/Loading";
import { NotFound } from "../NotFound";
import { UserContext, UserData } from "../../utils/hooks/UserContext";
import { EditNameWikiMembers } from "./EditNameWikiMembers";
import axios from "axios";
import { useHistory } from "react-router-dom";
import {
    Container,
    Box,
    Typography,
    useMediaQuery,
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import WarningIcon from "@mui/icons-material/Warning";
import { NotAllowed } from "../NotAllowed";

export const ProjectEdit = () => {
    const { user } = useContext(UserContext);
    const { userData } = useContext(UserData);
    const { projectId } = useParams();
    let history = useHistory();

    const [pageLoading, setPageLoading] = useState(true);
    const [notfound, setNotfound] = useState(false);
    const [project, setProject] = useState({});

    const [dialogOpen, setDialogOpen] = useState(false);

    const theme = createTheme();
    const isPhone = useMediaQuery(theme.breakpoints.down("sm"));

    const dialogClose = () => {
        setDialogOpen(false);
    }
    const deleteProject = async() => {
        return await axios
        .delete(`/project/${projectId}/`, { headers: JSON.parse(user) })
        .then((res) => {
            setDialogOpen(false);
            history.push(`/home`);
        })
        .catch((err) => {
            console.log(err);
            setDialogOpen(false);
        });
    }

    useEffect(() => {
        async function getProjectData() {
            return await axios
                .get("/project/" + projectId + "/", {
                    headers: JSON.parse(user),
                })
                .then((res) => {
                    if (res.status === 200) {
                        setProject(res.data);
                        setPageLoading(false);
                        setNotfound(false);
                    } else {
                        setPageLoading(false);
                        setNotfound(true);
                    }
                })
                .catch((err) => {
                    setPageLoading(false);
                    setNotfound(true);
                });
        }
        getProjectData();
    }, [user, projectId]);

    if (notfound) {
        return <NotFound />;
    }

    if (pageLoading) {
        return <Loading />;
    } else {
        if( !(userData.user_type === "admin" || userData.user_id === project.creator.user_id) || userData.is_disabled ){
            return <NotAllowed />
        }
        else
        return (
            <Container
                sx={{
                    mt: 3,
                    maxWidth: "100vw",
                    paddingRight: isPhone ? 3.5 : "auto",
                    minWidth: isPhone ? "100vw" : "inherit",
                }}
            >
                <Dialog open={dialogOpen} onClose={dialogClose}>
                    <DialogTitle id="dialog-title">
                        {"This project and all its data will be permanently deleted, do you want to proceed?"}
                    </DialogTitle>
                    <DialogActions>
                        <Button
                            color="success"
                            onClick={() => {
                                deleteProject();
                            }}
                        >
                            Yes
                        </Button>
                        <Button
                            color="error"
                            onClick={() => {
                                dialogClose();
                            }}
                            autoFocus
                        >
                            No
                        </Button>
                    </DialogActions>
                </Dialog>
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                    onClick={() => {
                        history.push(`/project/${project.id}`);
                    }}
                >
                    <Typography variant="h2">Edit project</Typography>
                    <Box>
                        <Button endIcon={<ExitToAppIcon />}>
                            Back to project
                        </Button>
                    </Box>
                </Box>

                <EditNameWikiMembers project={project} />
                <Box
                    sx={{
                        height: "fit-content",
                        margin: "auto",
                        mt: 2,
                        mb: 2,
                        borderRadius: 5,
                        backgroundColor: "white",
                        padding: "2%",
                        overflowX: "hidden",
                        overflowY: "auto",
                    }}
                >
                    <Typography variant="h4">Other actions:</Typography>
                    <Button 
                        endIcon={<WarningIcon />} 
                        color="error"
                        onClick={()=>{
                            setDialogOpen(true);
                        }}
                    >
                        Delete project
                    </Button>
                </Box>
            </Container>
        );
    }
};
