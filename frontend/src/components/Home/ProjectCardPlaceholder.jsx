import React from "react";
import {
    Skeleton,
    Card,
    CardContent,
    Typography,
    CardActions,
    Box,
    useTheme,
} from "@mui/material";

export const ProjectCardPlaceholder = () => {

    const theme = useTheme();

    return (
        <Box>
            <Card
                variant="outlined"
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 5,
                    cursor: "pointer",
                    width: 260,
                }}
            >
                <CardContent>
                    <Typography color="text.primary" variant="h5" noWrap component="div">
                        <Skeleton variant="text" />
                    </Typography>
                    <Typography color="text.primary"  color="text.secondary">
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
