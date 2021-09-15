import { useState, useEffect } from "react";
import axios from "axios";

export default function useFindUser() {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function findUser() {
      await axios
        .get('/check_cookie', {withCredentials: true})
        .then((res) => {
          setUser(JSON.stringify(res.data));
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    }
    findUser();
  }, []);

  return {
    user,
    setUser,
    isLoading,
  };
}
