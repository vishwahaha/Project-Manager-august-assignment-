import React from "react";
import { ListItem, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import { StrAvatar } from "../../utils/StrAvatar";

export const ListSearchItem = (props) => {
    const data = {
        'display_picture': props.avatar,
        'full_name': props.fullName,
    }
    return (
        <ListItem dense>
           <ListItemAvatar>
                <StrAvatar data={data} />
            </ListItemAvatar> 
            <ListItemText primary={props.fullName} secondary={props.enrolmentNumber} />
        </ListItem>
    );
}