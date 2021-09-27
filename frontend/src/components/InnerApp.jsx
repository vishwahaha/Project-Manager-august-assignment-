import React from "react";
import { Home } from "./Home/Home";
import { Navbar } from "./Navbar/Navbar";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "../utils/PrivateRoute";
import { CreateProject } from "./CreateProject/CreateProject";

export const InnerApp = () => {
    return (
        <div>
            <Navbar />
            <Switch>
                <PrivateRoute exact path="/home" component={Home} />
                <PrivateRoute exact path="/create_project" component={CreateProject} />
            </Switch>
        </div>
    );
}