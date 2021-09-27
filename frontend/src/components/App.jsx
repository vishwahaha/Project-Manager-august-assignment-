import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import PrivateRoute from "../utils/PrivateRoute";
import { Login } from "./Login/Login";
import { OAuth } from "./Login/OAuth";
import { UserContext, UserData } from "../utils/hooks/UserContext";
import useFindUser from "../utils/hooks/useFindUser";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { InnerApp } from "./InnerApp";

const theme = createTheme();

const useStyles = makeStyles((theme) => {
  root: {
    // some css that access to theme
  }
});

const App = () => {
  const { user, userData, setUser, setUserData, isLoading, setLoading } = useFindUser();
  return (
    <div>
      <ThemeProvider theme={theme}>
      <Router>
        <UserContext.Provider value={{ user, setUser }}>
        <UserData.Provider value={{userData, setUserData, isLoading, setLoading}}>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/oauth" component={OAuth} />
            <PrivateRoute component={InnerApp} />
          </Switch>
        </UserData.Provider>
        </UserContext.Provider>
      </Router>
      </ThemeProvider>
    </div>
  );
};

export default App;
