import React, { createContext, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "../utils/PrivateRoute";
import { Login } from "./Login/Login";
import { OAuth } from "./Login/OAuth";
import { UserContext, UserData } from "../utils/hooks/UserContext";
import useFindUser from "../utils/hooks/useFindUser";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { InnerApp } from "./InnerApp";
import { themes } from "../utils/themes";

export const DarkModeContext = createContext(null)

const App = () => {

    const { user, userData, setUser, setUserData, isLoading, setLoading } = useFindUser();
    const [darkMode, setDarkMode] = useState(false);

    const theme = createTheme({
        palette: themes[darkMode ? 'dark' : 'default'],
    });

    return (
        <div style={{ minHeight: '100vh', backgroundColor: theme.palette.background.default, }}>
            <ThemeProvider theme={theme}>
                <Router>
                    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
                    <UserContext.Provider value={{ user, setUser }}>
                        <UserData.Provider
                            value={{
                                userData,
                                setUserData,
                                isLoading,
                                setLoading,
                            }}
                        >
                            <Switch>
                                <Route exact path="/" component={Login} />
                                <Route path="/oauth" component={OAuth} />
                                <PrivateRoute component={InnerApp} />
                            </Switch>
                        </UserData.Provider>
                    </UserContext.Provider>
                    </DarkModeContext.Provider>
                </Router>
            </ThemeProvider>
        </div>
    );
};

export default App;
