import React from "react";
import {
    Card,
    CardContent,
    Typography,
    CardActions,
    Chip,
    Box,
    useTheme,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useHistory } from "react-router-dom";
import DOMPurify from "dompurify";

export const ProjectCard = (props) => {

    let history = useHistory();

    const theme = useTheme();

    const useStyles = makeStyles({
        finishedChip: {
            backgroundColor: theme.palette.finished.main,
            color: theme.palette.finished.text,
        },
        ongoingChip: {
            backgroundColor: theme.palette.pending.main,
            color: theme.palette.pending.text,
        },
        limitHeight: {
            cursor: "pointer",
        },
        cardHover: {
            "&:hover": {
                boxShadow: theme.shadows[3],
            },
        },
    });

    const myStyles = useStyles();

    function handleClick() {
        history.push("/project/" + props.projectId);
    }

    return (
        <Box className={myStyles.limitHeight}>
            <Card
                variant="outlined"
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 5,
                    width: 260,
                    m: "auto",  
                }}
                onClick={handleClick}
                className={myStyles.cardHover}
            >
                <CardContent sx={{ pb: 0, }}>
                    <Typography color="text.primary" variant="h6">
                        {props.title}
                    </Typography>
                    <Typography color="text.secondary">
                        Leader: {props.creator}
                    </Typography>
                    {/* <div
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(props.description),
                        }}
                        style={{ overflow: "hidden", maxHeight: 60 }}
                    ></div> */}
                </CardContent>
                <CardActions>
                    <Chip
                        label={props.finishedStatus ? "Finished" : "Ongoing"}
                        className={
                            props.finishedStatus
                                ? myStyles.finishedChip
                                : myStyles.ongoingChip  
                        }
                        sx={{ cursor: "pointer" }}
                    />
                </CardActions>
            </Card>
        </Box>
    );
};
