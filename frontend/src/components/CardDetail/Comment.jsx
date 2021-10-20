import React, { useState, useContext } from "react";
import { UserData } from "../../utils/hooks/UserContext";
import { Box, Avatar, Typography, IconButton, TextField, Button, useTheme } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

export const Comment = (props) => {

    const { userData } = useContext(UserData);

    const [editing, setEditing] = useState(false);
    const [content, setContent] = useState(props.comment.content);

    const theme = useTheme();

    const handleEdit = () => {
        setEditing(false);
        props.socket.send(JSON.stringify({
            'command': 'edit_comment',
            'id': props.comment.id,
            'content': content,
        }));
    }
    const handleDelete = () => {
        props.socket.send(JSON.stringify({
            'command': 'delete_comment',
            'id': props.comment.id,
        }));
    }

    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.default,
                borderRadius: 5,
                p: 1,
                mt: 1,
                mb: 1,
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    {props.comment.commentor.display_picture === null ? (
                        <Avatar
                            sx={{
                                bgcolor: "#6956C9",
                                mr: 0.5,
                            }}
                        >
                            {props.comment.commentor.full_name
                                .split(" ")
                                .map((item) => item.charAt(0))
                                .join("")
                                .toUpperCase()}
                        </Avatar>
                    ) : (
                        <Avatar
                            sx={{ mr: 0.5, }}
                            src={props.comment.commentor.display_picture}
                        />
                    )}
                    <Typography color="text.primary" ml={1} variant="h6">
                        {props.comment.commentor.full_name}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1, flexWrap: 'wrap', }}>
                    {userData.user_id === props.comment.commentor.user_id && (

                    !editing ? 
                    <IconButton
                        onClick={() => {
                            setEditing(true);
                        }}
                    >
                        <EditIcon />
                    </IconButton>
                    :
                    <IconButton
                        color="error"
                        onClick={() => {
                            setEditing(false);
                        }}
                    >
                        <HighlightOffIcon />
                    </IconButton>
                    )
                    }
                    {userData.user_id === props.comment.commentor.user_id &&
                    <IconButton
                        disabled={editing}
                        color="error"
                        onClick={handleDelete}
                    >
                        <DeleteIcon />
                    </IconButton>
                    }
                    <Typography variant="body2" color="text.secondary">
                        {props.comment.timestamp}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ p: 1 }}>
                {!editing ? 
                <Typography color="text.primary" variant="body1">
                    {props.comment.content}
                </Typography>
                :
                <Box>
                    <TextField
                        multiline
                        sx={{ width: '100%', backgroundColor: theme.palette.background.paper, }}   
                        value={content}
                        onChange={e => setContent(e.target.value)}
                    />
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 1, }}>
                        <Button 
                            color="success"
                            onClick={handleEdit}
                            variant="outlined"
                        >
                            save
                        </Button>
                    </Box>
                </Box>
                }
            </Box>
            {props.comment.is_edited &&
            <Box sx={{ ml: 1, fontStyle: 'italic', }}>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Edited
                </Typography>
            </Box>
            }
        </Box>
    );
};
