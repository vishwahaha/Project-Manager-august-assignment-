import React from "react";
import {
    Card,
    CardContent,
    CardActions,
    Chip,
    Typography,
    Box,
    Skeleton,
    useTheme
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useHistory } from "react-router-dom";


export const DashCard = (props) => {

    let history = useHistory();

    const theme = useTheme();

    const handleClick = () => {
        history.push(
            "/project/" +
                props.project +
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
            backgroundColor: theme.palette.finished.main,
            color: theme.palette.finished.text,
        },
        ongoingChip: {
            backgroundColor: theme.palette.pending.main,
            color: theme.palette.pending.text,
        },
        cardHover: {
            "&:hover": {
                boxShadow: theme.shadows[3],
            },
        },
    });

    const myStyles = useStyles();

    return (
        <Card
            variant="outlined"
            sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: 5,
                width: 250,
                minWidth: 250,
                height: 200,
                cursor: "pointer",
                m: 'auto',
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
                    <Typography color="text.primary" variant="h6" noWrap component="div">
                        {props.title}
                    </Typography>
                    <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                    >
                        Created by {props.creator.full_name}
                    </Typography>
                    <Typography
                        sx={{ fontSize: 13 }}
                        color="text.secondary"
                    >
                        Due date: {props.dueDate}
                    </Typography>
                    <Typography
                        className={myStyles.multiLineEllipsis}
                        variant="body2"
                        color="text.primary"
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
                            sx={{ cursor: "pointer", mb: 1, }}
                        />
                    </Box>
                </CardActions>
            </Box>
        </Card>
    );
};

export const DashCardSkeleton = () => {
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
                    <Typography color="text.primary" variant="h5" noWrap component="div">
                        <Skeleton variant="text" />
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        <Skeleton variant="text" />
                    </Typography>
                    <Typography color="text.primary" variant="body2">
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