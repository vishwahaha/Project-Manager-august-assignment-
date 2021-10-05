import React from "react";
import { useParams } from "react-router-dom";

export const CardDetail = () => {
    const { projectId, listId, cardId } = useParams();
    return (
        <div>
            this is card detail HI
            proj - {projectId}
            list - {listId}
            card - {cardId}
        </div>
    );
}