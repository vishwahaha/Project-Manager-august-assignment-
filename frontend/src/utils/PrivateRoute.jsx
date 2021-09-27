import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { UserContext, UserData } from "./hooks/UserContext";
import { Loading } from "../components/Login/Loading";

export default function PrivateRoute(props) {
  const { user } = useContext(UserContext);
  const { isLoading } = useContext(UserData);
  const { component: Component, ...rest } = props;
  if (isLoading) {
    return <Loading />;
  }
  if (user && !isLoading) {
    return <Route {...rest} render={(props) => <Component {...props} />} />;
  }
  if (!isLoading && user == null){
    return <Redirect to="/" />;
  }
}
