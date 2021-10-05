import React from "react";
import { Card, Chip, Typography, Avatar, Skeleton, Box } from "@mui/material";

export const ProjectMember = (props) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: 5,
                backgroundColor: "#e8e8e8",
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
                    <Typography variant="body1">{props.fullName}</Typography>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography variant="caption">
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
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: 5,
                backgroundColor: "#e8e8e8",
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
                    <Typography variant="body1">
                        <Skeleton variant="text" width={100} />
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography variant="caption">
                            <Skeleton variant="text" width={60} />
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
