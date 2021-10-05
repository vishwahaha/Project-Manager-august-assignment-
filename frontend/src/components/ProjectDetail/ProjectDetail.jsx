import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Loading } from "../Login/Loading";
import { NotFound } from "../NotFound";
import { UserContext, UserData } from "../../utils/hooks/UserContext";
import { ProjectMember, ProjectMemberSkeleton } from "./ProjectMember";
import { ListCard, ListCardSkeleton } from "./ListCard";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

import axios from "axios";
import DOMPurify from "dompurify";

import {
    Container,
    Box,
    Typography,
    useMediaQuery,
    AccordionSummary,
    Stack,
    Button,
    TextField,
    Card,
    CircularProgress,
    Modal,
} from "@mui/material";
import { LoadingButton } from '@mui/lab';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { makeStyles, styled } from "@mui/styles";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddBoxIcon from '@mui/icons-material/AddBox';


export const ProjectDetail = () => {
    const { user } = useContext(UserContext);
    const { userData } = useContext(UserData);
    const { projectId } = useParams();

    const [pageLoading, setPageLoading] = useState(true);
    const [notfound, setNotfound] = useState(false);
    const [project, setProject] = useState({});
    const [membersLoading, setMembersLoading] = useState(true);
    const [membersDetail, setMembersDetail] = useState([]);

    //States for list creation.
    const [addingNewList, setAddingNewList] = useState(false);
    const [newListTitle, setNewListTitle] = useState("");
    const [newListError, setNewListError] = useState(false);
    const [listRequestLoading, setListRequestLoading] = useState(false);
    const [listPostError, setListPostError] = useState(false);

    //States for card creation
    const [addingNewCard, setAddingNewCard] = useState(false);

    const theme = createTheme({
        palette: {
          primary: {
            main: '#6956C9',
          },
        },
    });
    const isPhone = useMediaQuery(theme.breakpoints.down("sm"));

    let tmpMemberDetail = [];

    useEffect(() => {
        async function getProjectData() {
            return await axios
                .get("/project/" + projectId + "/", {
                    headers: JSON.parse(user),
                })
                .then((res) => {
                    if (res.status === 200) {
                        console.log(res.data);
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
    }, [user, projectId, listRequestLoading]);

    useEffect(() => {
        function getProjectMember() {
            if (!pageLoading) {
                project.members.forEach(async (member, idx, arr) => {
                    await axios
                        .get("/user/" + member + "/", {
                            headers: JSON.parse(user),
                        })
                        .then((res) => {
                            if (res.status === 200) {
                                tmpMemberDetail.push(res.data);
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                    try {
                        if (tmpMemberDetail.length === project.members.length) {
                            setMembersDetail(tmpMemberDetail);
                            setMembersLoading(false);
                        }
                    } finally {
                    }
                });
            }
        }
        getProjectMember();
    }, [project, pageLoading]);

    const addNewList = () => {
        setAddingNewList(true);
    }

    const closeAddNewList = () => {
        setNewListError(false);
        setAddingNewList(false);    
    }

    const handleNewListTitle = (e) => {
        setNewListError(false);
        setNewListTitle(e.target.value);
    }

    const saveNewList = async() => {
        if(newListTitle.trim() === ""){
            setNewListError(true);
        }
        else{
            setListRequestLoading(true);
            const data = {
                title: newListTitle.trim(),
            }
            return await axios
            .post('/project/'+projectId+'/list/', data, { headers: JSON.parse(user), })
            .then((res) => {
                console.log(res);
                if(res.status === 201){
                    setNewListTitle("");
                    setNewListError(false);
                    setListPostError(false);
                    setListRequestLoading(false);
                    setAddingNewList(false);    
                }
                else {
                    setListRequestLoading(false);
                    setListPostError(true);
                }
            })
            .catch((err) => {
                console.log(err);
                setListPostError(true);
                setListRequestLoading(false);
            });
        }
    }

    const addNewCard = () => {
        setAddingNewCard(true);
    }

    const useStyles = makeStyles({
        scrollBar: {
            "&::-webkit-scrollbar": {
                width: "7px",
                height: "7px",
                backgroundColor: "#F5F5F5",
            },
            "&::-webkit-scrollbar-track": {
                "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.3)",
                backgroundColor: "#F5F5F5",
            },
            "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#6956C9",
            },
        },  
    });

    const myStyles = useStyles();

    const Accordion = styled((props) => (
        <MuiAccordion elevation={0}  {...props} />
      ))(({ theme }) => ({
        border: `0px`,
        '&:not(:last-child)': {
          borderBottom: 0,
        },
        borderRadius: 10,
        '&:before': {
          display: 'none',
        },
        '&:first-child': {
            borderRadius: 10,
        },
        '&:last-child': {
            borderRadius: 10,
        },
        margin: '7px',
    }));
      
    const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
        padding: theme.spacing(2),
        borderTop: '1px solid rgba(0, 0, 0, .125)',
    }));
      

    if (notfound) {
        return <NotFound />;
    }

    if (pageLoading) {
        return <Loading />;
    } else {
        return (
            <ThemeProvider theme={theme}>
            <Container
                sx={{
                    mt: 3,
                    maxWidth: "100vw",
                    paddingRight: isPhone ? 3.5 : "auto",
                    minWidth: isPhone ? "100vw" : "inherit",
                }}
            >
                <Modal
                    open={addingNewCard}
                >
                    <Box>
                        CARD CREATION INTERFACE HERE
                    </Box>
                </Modal>
                <Box>
                    <Typography variant="h2">{project.name}</Typography>
                    <Typography variant="h6" color="#878787">
                        Leader: {project.creator.full_name}
                    </Typography>
                </Box>
                <div
                    className={myStyles.scrollBar}
                    style={{
                        backgroundColor: "white",
                        borderRadius: "10px",
                        overflow: "auto",
                        padding: "10px",
                        maxWidth: "95vw",
                        maxHeight: "90vh",
                    }}
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(project.wiki),
                    }}
                ></div>
                <Box sx={{ mt: 5, mb: 5 }}>
                    <Typography variant="h4">Project members</Typography>
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            backgroundColor: "#fafafa",
                            borderRadius: 5,
                        }}
                    >
                        {membersLoading
                            ? project.members.map((member, idx) => {
                                  return <ProjectMemberSkeleton key={idx} />;
                              })
                            : membersDetail.map((member, idx) => {
                                  return (
                                      <ProjectMember
                                          key={idx}
                                          avatar={member.display_picture}
                                          fullName={member.full_name}
                                          enrolmentNumber={
                                              member.enrolment_number
                                          }
                                          userType={member.user_type}
                                          isDisabled={member.is_disabled}
                                      />
                                  );
                              })}
                    </Box>
                </Box>

                <Box sx={{ mt: 5, mb: 5 }}>
                    <Typography variant="h4">Lists</Typography>
                    <Box>
                        {project.list_set.map((list, idx) => {
                            return (
                                <Accordion
                                    key={idx}
                                    sx={{
                                        boxShadow: "none",
                                        border: "1px solid #b8b8b8",
                                    }}
                                    TransitionProps={{ unmountOnExit: true }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                    >
                                        <Typography>{list.title}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Stack
                                            spacing={2}
                                            overflow={false}
                                            direction="row"
                                            className={myStyles.scrollBar}
                                            sx={{ 
                                                overflowX: "auto",
                                                height: "fit-content",
                                                p: 1,
                                                maxHeight: 220,
                                            }}
                                            alignItems="flex-start"
                                        >
                                            
                                            {!membersLoading &&
                                                <Card
                                                    variant="outlined"
                                                    sx={{
                                                        backgroundColor: "#f7f7f7",
                                                        borderRadius: 5,
                                                        width: 250,
                                                        minWidth: 250,
                                                        height: 200,
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Button 
                                                        endIcon={<AddBoxIcon />} 
                                                        sx={{ fontSize: 18, }}
                                                        onClick={addNewCard}
                                                    >
                                                        New card
                                                    </Button>
                                                </Card>
                                            }
                                            
                                            {membersLoading ? 
                                            (
                                                list.card_set.map((card, index) => {
                                                    <ListCardSkeleton key={index} />
                                                }) 
                                            ) : (
                                                list.card_set.map((card, index) => {
                                                    return (
                                                        <ListCard 
                                                            key={index}
                                                            projectId={project.id}
                                                            listId={list.id}
                                                            cardId={card.id}
                                                            title={card.title} 
                                                            creator={
                                                                membersDetail.find((member) => {
                                                                    return member.user_id === card.creator
                                                                }).full_name
                                                            } 
                                                            desc={card.desc} 
                                                            finishedStatus={card.finished_status} 
                                                        />
                                                    )
                                                })
                                            )}
                                        </Stack>
                                    </AccordionDetails>
                                </Accordion>
                            );
                        })}
                        <Box sx={{ backgroundColor: 'white', borderRadius: 2, m: '7px', p: 1, }} >
                            {!addingNewList ?
                            <Box>
                                <Box sx={{ cursor: 'default', width: '100%', height: '100%', textAlign: 'center',}}>
                                    <Button     
                                        endIcon={<PlaylistAddIcon />}
                                        onClick={addNewList}
                                    >
                                        Add a new list
                                    </Button>
                                </Box>
                            </Box>
                            :
                            <Box sx={{ p: 2, }}>
                                <Box 
                                    sx={{   
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'space-evenly', 
                                        flexWrap: 'wrap', 
                                        margin: 'auto', 
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', }}>
                                        <TextField 
                                            autoComplete="off"
                                            error={newListError || listPostError}
                                            label={newListError ? "Invalid list title" : (listPostError ? "Some error occurred." : "List title")} 
                                            helperText={listPostError && "You might be disabled"}
                                            sx={{ width: '100%', }} 
                                            value={newListTitle} 
                                            onChange={handleNewListTitle}
                                        />
                                        <LoadingButton 
                                            loading={listRequestLoading}
                                            color="success" 
                                            variant="contained" 
                                            sx={{ m: 2, boxShadow: 'none', }} 
                                            onClick={saveNewList} 
                                        >
                                            SAVE
                                        </LoadingButton>
                                    </Box>
                                    <LoadingButton 
                                        loading={listRequestLoading}
                                        color="error" 
                                        onClick={closeAddNewList}
                                    >
                                        Close
                                    </LoadingButton>
                                </Box>
                            </Box>
                            }   
                        </Box>
                    </Box>
                </Box>
            </Container>
            </ThemeProvider>
        );
    }
};
