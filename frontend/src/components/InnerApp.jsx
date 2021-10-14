import React from "react";
import { Home } from "./Home/Home";
import { Switch, } from "react-router-dom";
import PrivateRoute from "../utils/PrivateRoute";
import { CreateProject } from "./CreateProject/CreateProject";
import { ProjectDetail } from "./ProjectDetail/ProjectDetail";
import { ProjectEdit } from "./ProjectDetail/ProjectEdit";
import { NotFound } from "./NotFound";
import { MiniDrawer } from "./Navbar/FullNav";
import { CardDetail } from "./CardDetail/CardDetail";
import { CardEdit } from "./CardDetail/CardEdit";
import { ListEdit } from "./ListEdit/ListEdit";
import { NotAllowed } from "./NotAllowed";
import { AdminPanel } from "./AdminPanel/AdminPanel";
import { Dashboard } from "./Dashboard/Dashboard";
import { Settings } from "./Settings/Settings";

export const InnerApp = () => {
    return (
            <MiniDrawer>
                <Switch>
                    <PrivateRoute exact path="/home" component={Home} />
                    <PrivateRoute exact path="/dashboard" component={Dashboard} />
                    <PrivateRoute exact path="/create_project" component={CreateProject} />
                    <PrivateRoute exact path="/project/:projectId" component={ProjectDetail} />
                    <PrivateRoute exact path="/project/:projectId/edit" component={ProjectEdit} />
                    <PrivateRoute exact path="/project/:projectId/:listId/edit" component={ListEdit} />
                    <PrivateRoute exact path="/project/:projectId/:listId/:cardId" component={CardDetail} />
                    <PrivateRoute exact path="/project/:projectId/:listId/:cardId/edit" component={CardEdit} />
                    <PrivateRoute exact path="/admin" component={AdminPanel} />
                    <PrivateRoute exact path="/settings" component={Settings} />

                    <PrivateRoute exact path="/not_allowed" component={NotAllowed} />
                    <PrivateRoute component={NotFound} />
                </Switch>
            </MiniDrawer>
    );
}