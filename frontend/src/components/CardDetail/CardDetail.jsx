import React, { useState, useEffect, useContext, } from "react";
import { UserContext, UserData } from "../../utils/hooks/UserContext";
import { Container, Box, Typography, Chip, Button, useTheme } from "@mui/material";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { Loading } from "../Login/Loading";
import { CommentSection } from "./CommentSection";
import { ProjectMember } from "../ProjectDetail/ProjectMember";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import EditIcon from '@mui/icons-material/Edit';

export const CardDetail = () => {
    const { user } = useContext(UserContext);
    const { userData } = useContext(UserData);

    const [loading, setLoading] = useState(true);
    const [card, setCard] = useState({});

    const { projectId, listId, cardId } = useParams();
    let history = useHistory();

    const socket = new WebSocket(`ws://localhost:8000/ws/card/${cardId}/`);

    const theme = useTheme();

    useEffect(() => {
        async function getCard() {
            return await axios
                .get(`/project/${projectId}/list/${listId}/card/${cardId}/`, {
                    headers: JSON.parse(user),
                })
                .then((res) => {
                    setCard(res.data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        getCard();

        return () => {
            socket.send(JSON.stringify({
                'command': 'disconnect',
            }));
        }

    }, [user]);

    if (loading) {
        return <Loading />;
    } else
        return (
            <Container maxWidth="lg" sx={{ maxWidth: "90vw", mt: 2 }}>
                <Typography color="text.primary" variant="h3">{card.title}</Typography>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        backgroundColor: card.finished_status ? theme.palette.finished.bg : theme.palette.pending.bg,
                        borderRadius: 5, 
                        p: 2,
                        mt: 2, 
                        mb: 2,                    
                    }}
                >
                    <Chip
                        label={card.finished_status ? 'Done' : 'Pending'}
                        size="medium"
                        sx={{
                            backgroundColor: card.finished_status ? theme.palette.finished.main : theme.palette.pending.main,
                            color: card.finished_status ? theme.palette.finished.text : theme.palette.pending.text,
                        }}
                    />
                    <Box>{(userData.user_type==="admin" || 
                           userData.user_id===card.creator.user_id || 
                           userData.user_id===card.project_creator.user_id) &&
                        <Button 
                            disabled={userData.is_disabled}
                            endIcon={<EditIcon />} 
                            sx={{ mr: 1, }}
                            onClick={() => {
                                history.push(`/project/${projectId}/${listId}/${cardId}/edit`);
                            }}
                        >
                            Edit
                        </Button>
                        }
                        <Button 
                            endIcon={<ExitToAppIcon />}
                            onClick={() => {
                                history.push(`/project/${projectId}`);
                            }}
                        >
                            Back to project
                        </Button>
                    </Box>
                </Box>
                <Box
                    sx={{
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: 5,
                        p: 2,
                    }}
                >
                    <Typography color="text.primary" variant="body1">{card.desc}</Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Typography color="text.primary" variant="h4">Assignees:</Typography>
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: 5,
                        }}
                    >
                        {card.assignees.map((member, idx) => {
                            return (
                                <ProjectMember
                                    key={idx}
                                    avatar={member.display_picture}
                                    fullName={member.full_name}
                                    enrolmentNumber={member.enrolment_number}
                                    userType={member.user_type}
                                    isDisabled={member.is_disabled}
                                />
                            );
                        })}
                        {card.assignees.length===0 &&
                        <Box sx={{ p: 2, }}>
                            <Typography color="text.secondary" variant="h4">
                                No assignees to this card.
                            </Typography>
                        </Box>
                        }
                    </Box>
                </Box>
                <CommentSection
                    socket={socket}
                    cardId={cardId}
                />
            </Container>
        );
};
