import React, { useContext } from "react";
import { Button } from "@material-ui/core";
import { UserContext } from "../../utils/hooks/UserContext";
import useLogout from "../../utils/hooks/useLogout";

export const Home = () => {
  const { user, isLoading } = useContext(UserContext);
  const { logoutUser } = useLogout();
  return (
    <div>
      <form>
        <Button
          color="primary"
          type="submit"
          disableElevation
          onClick={logoutUser}
        >
          Log out
        </Button>
      </form>
      {user}
    </div>
  );
};
