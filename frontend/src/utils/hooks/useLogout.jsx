import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "./UserContext";
import axios from "axios";

export default function useLogout() {
  let history = useHistory();
  const { user, isLoading } = useContext(UserContext);
  let header  = JSON.parse(user);

  const logoutUser = async () => {
    try {
      await axios
        .get("/logout", {headers: header})
        .then((res) => {
          history.push("/");
        })
        .catch((err) => {
          console.log(err);
        });
    } finally {
    }
  };
  return {
    logoutUser,
  };
}
