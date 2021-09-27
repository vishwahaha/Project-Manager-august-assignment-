import { useState, useEffect } from "react";
import axios from "axios";

export default function useFindUser() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function findUser() {
      await axios
        .get('/check_cookie', {withCredentials: true})
        .then(async(res) => {
          if(res.status === 200){
            setUser(JSON.stringify(res.data));
          }
        })
        .catch((err) => {
          setLoading(false);
        });
    }
    findUser();
  }, []);

  useEffect(() => {
    const getUserDetails = async() => {
      if(user){
          return await axios
          .get('/user_details', { headers: JSON.parse(user) })
          .then(async(res) => {
              if(res.status === 200){
                  setUserData(res.data);
                  setLoading(false);
              }
          });
      }
    }
    getUserDetails();
  }, [user]);


  return {
    user,
    userData,
    setUser,
    setUserData,
    isLoading,
    setLoading
  };
}
