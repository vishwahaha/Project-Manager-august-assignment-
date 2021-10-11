import React, { useState, useEffect, useContext } from "react";
import { UserContext, UserData } from "../../utils/hooks/UserContext";
import { Container, Box, Typography, Chip, Button } from "@mui/material";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { Loading } from "../Login/Loading";
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

    useEffect(() => {
        async function getCard() {
            return await axios
                .get(`/project/${projectId}/list/${listId}/card/${cardId}/`, {
                    headers: JSON.parse(user),
                })
                .then((res) => {
                    console.log(res.data);
                    setCard(res.data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        getCard();
    }, [user]);

    if (loading) {
        return <Loading />;
    } else
        return (
            <Container maxWidth="lg" sx={{ maxWidth: "90vw", mt: 2 }}>
                <Typography variant="h3">{card.title}</Typography>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        backgroundColor: card.finished_status ? '#f3ffed' : 'white',
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
                            backgroundColor: card.finished_status ? '#a8eda6' : '#ff7d7d',
                            color: card.finished_status ? 'black' : 'white',
                        }}
                    />
                    <Box>
                        <Button 
                            endIcon={<EditIcon />} 
                            sx={{ mr: 1, }}
                            onClick={() => {
                                history.push(`/project/${projectId}/${listId}/${cardId}/edit`);
                            }}
                        >
                            Edit
                        </Button>
                        <Button 
                            endIcon={<ExitToAppIcon />}
                            onCLick={() => {
                                history.push(`/project/${projectId}`);
                            }}
                        >
                            Back to project
                        </Button>
                    </Box>
                </Box>
                <Box
                    sx={{
                        backgroundColor: "white",
                        borderRadius: 5,
                        p: 2,
                    }}
                >
                    <Typography variant="body1">{card.desc}</Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Typography variant="h3">Assignees:</Typography>
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            backgroundColor: "#fafafa",
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
                    </Box>
                </Box>
            </Container>
        );
};
