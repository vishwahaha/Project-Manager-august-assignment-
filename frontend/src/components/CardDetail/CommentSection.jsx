import React, { useEffect, useState, useContext, } from "react";
import { UserData } from "../../utils/hooks/UserContext";
import { Box, Typography, TextField, useTheme } from "@mui/material";
import { Comment } from "./Comment";
import { LoadingButton } from "@mui/lab";
import moment from 'moment';

export const CommentSection  = (props) => {

    const { userData } = useContext(UserData);

    const [loaded, setLoaded] = useState(false);
    const [comments, setComments] = useState([]);

    const [commentLoading, setCommentLoading] = useState(false);
    const [newComment, setNewComment] = useState("");

    const theme = useTheme();

    useEffect(() => {

        props.socket.onopen = () => {
            props.socket.send(JSON.stringify({ 'command': 'load_comments', }));
        }

        props.socket.onmessage = (e) => {
            let data = JSON.parse(e.data);

            if(data.variant === 'loaded_comments'){
                if(data.comments.length === 0){
                    setLoaded(true);

                }
                else{
                    data.comments.map((comment, idx) => {
                        comment.timestamp = moment(comment.timestamp).local().format('hh:mm A, DD-MM-YYYY');
                        if(idx === data.comments.length - 1){
                            setComments(data.comments);
                            setLoaded(true);
                        }
                    });
                }
            }

            if(data.variant === 'new_comment'){
                if(data.commentor.user_id === userData.user_id){
                    setNewComment('');
                    setCommentLoading(false);
                }
                data.timestamp = moment(data.timestamp).local().format('hh:mm A, DD-MM-YYYY');
                setComments(prev => [...prev, data]);
            }

            if(data.variant === 'delete_comment'){
                setComments(prev => 
                    prev.filter((comment) => {
                        return comment.id !== data.id;
                    })
                );
            }

            if(data.variant === 'edited_comment'){
                setComments(prev => 
                    prev.map((comment) => {
                        if(comment.id === data.id){
                            comment = data;
                            comment.timestamp = moment(comment.timestamp).local().format('hh:mm A, DD-MM-YYYY');
                            return comment;
                        }
                        return comment;
                    })
                );
            }
        }
    }, []);

    const handleNewComment = (e) => {
        e.preventDefault();
        setCommentLoading(true);
        const sendData = {
            'command': 'new_comment',
            'commentor': userData.user_id,
            'card': props.cardId,
            'content': newComment,
        }
        props.socket.send(JSON.stringify(sendData))
    }

    return (
        <Box
            sx={{ 
                mt: 2,
                mb: 2,
            }}
        >
            <Typography color="text.primary" variant="h4">
                Comments:
            </Typography>
            <Box
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 5,
                    p: 2,
                    pb: 1,
                }}
            >
                <Box sx={{ mt: 1, mb: 2, }}>
                    <form onSubmit={handleNewComment}>
                        <Box
                            sx={{ 
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <TextField
                                multiline
                                sx={{ width: '100%', mr: 2, }}
                                placeholder="Add a new comment" 
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                            />
                            <LoadingButton
                                disabled={newComment.trim() === ""}
                                loading={commentLoading}
                                variant="contained"
                                color="success"
                                sx={{ boxShadow: 'none', }}
                                type="submit"   
                            >
                                post
                            </LoadingButton>
                        </Box>
                    </form>
                </Box>

                {loaded &&
                comments.map((comment, idx) => {
                    return (
                        <Comment
                            key={idx}
                            comment={comment}
                            socket={props.socket}
                        />
                    );
                })
                }

            </Box>
        </Box>
    );
}