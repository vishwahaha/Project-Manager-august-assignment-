import React from "react";
import { Home } from "./Home/Home";
import { Navbar } from "./Navbar/Navbar";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "../utils/PrivateRoute";
import { CreateProject } from "./CreateProject/CreateProject";
import { ProjectDetail } from "./ProjectDetail/ProjectDetail";
import { NotFound } from "./NotFound";
import { MiniDrawer } from "./Navbar/FullNav";
import { CardDetail } from "./CardDetail/CardDetail";

export const InnerApp = () => {
    return (
            <MiniDrawer>
                <Switch>
                    <PrivateRoute exact path="/home" component={Home} />
                    <PrivateRoute exact path="/create_project" component={CreateProject} />
                    <PrivateRoute exact path="/project/:projectId" component={ProjectDetail} />
                    <PrivateRoute exact path="/project/:projectId/:listId/:cardId" component={CardDetail} />
                    <PrivateRoute component={NotFound} />
                </Switch>
            </MiniDrawer>
    );
}