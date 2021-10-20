import React, { useContext } from "react";
import { UserData } from "../../utils/hooks/UserContext";
import useLogout from "../../utils/hooks/useLogout";
import { useHistory } from "react-router";
import {
    useMediaQuery,
    createTheme,
    Box,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemText,
    Avatar,
    useTheme,
} from "@mui/material";
import { styled, } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import { ListItemIcon } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(9)} + 1px)`,
    },
});

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
    }),
}));

export const MiniDrawer = (props) => {
    const [open, setOpen] = React.useState(false);
    const { userData } = useContext(UserData);
    const { logoutUser } = useLogout();
    let history = useHistory();

    const theme = useTheme();

    const isPhone = useMediaQuery(theme.breakpoints.down("sm"));

    const takeHome = () => {
        history.push("/home");
    };

    const takeDashboard = () => {
        history.push("/dashboard");
    };

    const takeNewProject = () => {
        history.push('/create_project');
    }

    const takeAdmin = () => {
        history.push("/admin");
    }

    const takeSettings = () => {
        history.push('/settings');
    }

    const logout = () => {
        logoutUser();
        window.location.reload();
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const MobileDrawer = () => {
        if (!isPhone) {
            return true;
        }
        if (isPhone && open) {
            return true;
        } else {
            return false;
        }
    };

    return (
        <Box sx={{ display: "flex" }}>
            <AppBar
                position="fixed"
                open={open}
                sx={{ boxShadow: 'none', }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: "36px",
                            ...(open && { display: "none" }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    {!(isPhone && open) && (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                width: "100%",
                            }}
                        >
                            <Box
                                onClick={takeHome}
                                sx={{
                                    display: "flex",
                                    cursor: "pointer",
                                    alignItems: "center",
                                }}
                            >
                                    <AppRegistrationIcon
                                        sx={{ fontSize: 35, mr: 2 }}
                                    />
                                    <Typography
                                        variant={isPhone ? "h5" : "h4"}
                                        component="div"
                                        sx={{ 
                                            flexGrow: 1, 
                                            fontWeight: 600,
                                            fontFamily: ["Glory", "sans-serif"].join(","),
                                        }}
                                    >
                                        Sorted
                                    </Typography>
                            </Box>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>

            {MobileDrawer() && (
                <Drawer variant="permanent" open={open}>
                    <DrawerHeader>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            {userData.display_picture === null ? (
                                <Avatar
                                    sx={{
                                        bgcolor: "#6956C9",
                                        mr: 1.5,
                                        ml: 1.5,
                                    }}
                                >
                                    {userData.full_name
                                        .split(" ")
                                        .map((item) => item.charAt(0))
                                        .join("")
                                        .toUpperCase()}
                                </Avatar>
                            ) : (
                                <Avatar
                                    sx={{ mr: 1.5, ml: 1.5 }}
                                    src={userData.display_picture}
                                />
                            )}
                            <Typography color="text.primary">{userData.full_name}</Typography>
                        </Box>
                        <IconButton onClick={handleDrawerClose}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <List>
                        <ListItem button onClick={takeHome}>
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItem>
                        <ListItem button onClick={takeDashboard}>
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItem>
                        <ListItem disabled={userData.is_disabled} button onClick={takeNewProject}>
                            <ListItemIcon>
                                <CreateNewFolderIcon />
                            </ListItemIcon>
                            <ListItemText primary="Add a new project" />
                        </ListItem>
                        {userData.user_type === "admin" &&
                        <ListItem button onClick={takeAdmin}>
                            <ListItemIcon>
                                <AdminPanelSettingsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Admin panel" />
                        </ListItem>
                        }       
                    </List>
                    <Divider />
                    <List>
                        <ListItem button onClick={takeSettings}>
                            <ListItemIcon>
                                <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Settings" />
                        </ListItem>
                        <ListItem button onClick={logout}>
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItem>
                    </List>
                </Drawer>
            )}

            <Box 
                component="main" 
                sx={{ 
                    flexGrow: 1, 
                }}
            >
                <DrawerHeader />
                {props.children}
            </Box>
        </Box>
    );
};
