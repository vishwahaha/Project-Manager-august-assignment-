import { CircularProgress, Box, useTheme } from "@mui/material";

export const Loading = () => {

    const theme = useTheme();

    return (
        <Box 
            sx={{
                position: 'absolute',
                width: '100vw',
                height: '100vh',
                backgroundColor: theme.palette.background.default,
                zIndex: 999,
                display: 'flex',
                justifyContent: 'center', 
                alignItems: 'center',
            }}
        >
            <CircularProgress color="primary" size="5rem" />
        </Box>
    );
}