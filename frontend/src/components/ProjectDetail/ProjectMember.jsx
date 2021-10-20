import React from "react";
import { Chip, Typography, Avatar, Skeleton, Box, useTheme } from "@mui/material";

export const ProjectMember = (props) => {

    const theme = useTheme();

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: 5,
                backgroundColor: theme.palette.background.default,
                p: 1.5,
                pr: 2,
                margin: 1,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                }}
            >
                {props.avatar === null ? (
                    <Avatar sx={{ bgcolor: "#6956C9", mr: 1 }}>
                        {props.fullName
                            .split(" ")
                            .map((item) => item.charAt(0))
                            .join("")
                            .toUpperCase()}
                    </Avatar>
                ) : (
                    <Avatar sx={{ mr: 1 }} src={props.avatar} />
                )}
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography color="text.primary" variant="body1">{props.fullName}</Typography>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography color="text.primary" variant="caption">
                            {props.enrolmentNumber}
                        </Typography>
                        {props.userType === "admin" && (
                            <Chip
                                label="Admin"
                                color="error"
                                size="small"
                                sx={{ ml: 0.5 }}
                            />
                        )}
                        {props.isDisabled && (
                            <Chip
                                label="Disabled"
                                color="warning"
                                size="small"
                                sx={{ ml: 0.5 }}
                            />
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export const ProjectMemberSkeleton = () => {

    const theme = useTheme();

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: 5,
                backgroundColor: theme.palette.background.default,
                p: 1.5,
                pr: 2,
                margin: 1,
                width: 150,
                height: 50,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                }}
            >
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ display: "flex", flexDirection: "column", ml: 1, }}>
                    <Typography color="text.primary" variant="body1">
                        <Skeleton variant="text" width={100} />
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography color="text.primary" variant="caption">
                            <Skeleton variant="text" width={60} />
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
