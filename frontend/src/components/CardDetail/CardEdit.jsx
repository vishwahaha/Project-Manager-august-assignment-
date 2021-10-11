import React, { useState, useContext, useEffect } from "react";
import { UserData, UserContext } from "../../utils/hooks/UserContext";
import axios from "axios";
import { Loading } from "../Login/Loading";
import { useParams } from "react-router-dom";
import { EditTitleDescMem } from "./EditTitleDescMem";
import { NotAllowed } from "../NotAllowed";


export const CardEdit = () => {

    const { user } = useContext(UserContext);
    const { userData } = useContext(UserData);
    const { projectId, listId, cardId } = useParams();

    const [loading, setLoading] = useState(true);

    const [card, setCard] = useState({});
  
    useEffect(() => {
        async function getCard(){
            return await axios
            .get(`/project/${projectId}/list/${listId}/card/${cardId}/`, { headers: JSON.parse(user), })
            .then((res) => {
                setCard(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
        }
        getCard();
    }, [user]);


    if(loading){
        return <Loading />
    }

    else{
        if(!(userData.user_type==='admin' || userData.user_id===card.creator.user_id || userData.user_id===card.project_creator.user_id)){
            return <NotAllowed />
        }
        else
        return (
            <EditTitleDescMem card={card} />
        );
    }
};
