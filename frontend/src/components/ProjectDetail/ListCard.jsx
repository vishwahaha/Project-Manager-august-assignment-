import React, { useContext, useState } from "react";
import {
    Card,
    CardContent,
    CardActions,
    Chip,
    Typography,
    Box,
    Skeleton,
    IconButton,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import EditIcon from '@mui/icons-material/Edit';
import { useHistory } from "react-router-dom";
import { UserData } from "../../utils/hooks/UserContext";

export const ListCard = (props) => {

    const { userData } = useContext(UserData);
    let history = useHistory();

    const handleClick = () => {
        history.push(
            "/project/" +
                props.projectId +
                "/" +
                props.listId +
                "/" +
                props.cardId
        );
    };

    const useStyles = makeStyles({
        multiLineEllipsis: {
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            "-webkit-line-clamp": 3,
            "-webkit-box-orient": "vertical",
        },
        finishedChip: {
            backgroundColor: "#a8eda6",
        },
        ongoingChip: {
            backgroundColor: "#ff7d7d",
            color: "white",
        },
        cardHover: {
            "&:hover": {
                backgroundColor: props.finishedStatus ? "#f5fff0" : "#f5f5f5",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                borderColor: props.finishedStatus ? "#f5fff0" : "#f5f5f5",
            },
        },
    });

    const myStyles = useStyles();

    return (
        <Card
            variant="outlined"
            sx={{
                backgroundColor: props.finishedStatus ? "#f3ffed" : "#f7f7f7",
                borderRadius: 5,
                width: 250,
                minWidth: 250,
                height: 200,
                cursor: "pointer",
            }}
            onClick={handleClick}
            className={myStyles.cardHover}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                }}
            >
                <CardContent>
                    <Typography variant="h6" noWrap component="div">
                        {props.title}
                    </Typography>
                    <Typography
                        sx={{ mb: 1, fontSize: 15 }}
                        color="text.secondary"
                    >
                        Created by {props.creator.full_name}
                    </Typography>
                    <Typography
                        className={myStyles.multiLineEllipsis}
                        variant="body2"
                    >
                        {props.desc}
                    </Typography>
                </CardContent>
                <CardActions sx={{ pt: 0, pb: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', }}>
                    <Box 
                        sx={{
                            width: '100%', 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            bottom: 0,
                        }}
                        >
                        <Chip
                            label={props.finishedStatus ? "Done" : "Pending"}
                            className={
                                props.finishedStatus
                                    ? myStyles.finishedChip
                                    : myStyles.ongoingChip
                            }
                            sx={{ cursor: "pointer" }}
                        />
                        {(userData.user_type==="admin" || userData.user_id===props.creator.user_id) &&
                        <IconButton 
                            sx={{zIndex: 999,}}
                            color="primary"
                            onClick={(e) => {
                                e.stopPropagation();
                                history.push(`/project/${props.projectId}/${props.listId}/${props.cardId}/edit`)
                            }}
                            size="large"
                        >
                            <EditIcon />
                        </IconButton>
                        }   
                    </Box>
                </CardActions>
            </Box>
        </Card>
    );
};

export const ListCardSkeleton = () => {
    return (
        <Card
            variant="outlined"
            sx={{
                backgroundColor: "#f7f7f7",
                borderRadius: 5,
                cursor: "pointer",
                width: 250,
                minWidth: 250,
                height: 200,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                }}
            >
                <CardContent>
                    <Typography variant="h5" noWrap component="div">
                        <Skeleton variant="text" />
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        <Skeleton variant="text" />
                    </Typography>
                    <Typography variant="body2">
                        <Skeleton variant="text" />
                        <Skeleton variant="text" />
                    </Typography>
                </CardContent>
                <CardActions>
                    <Skeleton
                        variant="rectangular"
                        width={70}
                        height={32}
                        sx={{ borderRadius: 10 }}
                    />
                </CardActions>
            </Box>
        </Card>
    );
};
