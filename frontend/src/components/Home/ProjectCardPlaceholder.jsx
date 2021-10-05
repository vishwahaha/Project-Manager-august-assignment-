import React from "react";
import {
    Skeleton,
    Card,
    CardContent,
    Typography,
    CardActions,
    Box,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

export const ProjectCardPlaceholder = () => {
    const useStyles = makeStyles({
        multiLineEllipsis: {
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            "-webkit-line-clamp": 3,
            "-webkit-box-orient": "vertical",
        },
        limitHeight: {
            maxHeight: 225,
        },
    });

    const myStyles = useStyles();

    return (
        <Box className={myStyles.limitHeight}>
            <Card
                variant="outlined"
                sx={{
                    backgroundColor: "#e8e8e8",
                    borderRadius: 5,
                    borderColor: "#b0b0b0",
                    cursor: "pointer",
                    width: 260,
                }}
            >
                <CardContent>
                    <Typography variant="h5" noWrap component="div">
                        <Skeleton variant="text" />
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        <Skeleton variant="text" />
                    </Typography>
                    <Typography
                        className={myStyles.multiLineEllipsis}
                        variant="body2"
                    >
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
            </Card>
        </Box>
    );
};
