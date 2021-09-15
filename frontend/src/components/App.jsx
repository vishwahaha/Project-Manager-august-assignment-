import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
} from "react-router-dom";
import PrivateRoute from "../utils/PrivateRoute";
import { Login } from "./Login/Login";
import { OAuth } from "./Login/OAuth";
import { Home } from "./Home/Home";
import { UserContext } from "../utils/hooks/UserContext";
import useFindUser from "../utils/hooks/useFindUser";

const App = () => {
  const { user, setUser, isLoading } = useFindUser();
  return (
    <div>
      <Router>
        <UserContext.Provider value={{ user, setUser, isLoading }}>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/oauth" component={OAuth} />
            <PrivateRoute path="/home" component={Home} />
          </Switch>
        </UserContext.Provider>
      </Router>
    </div>
  );
};

export default App;
