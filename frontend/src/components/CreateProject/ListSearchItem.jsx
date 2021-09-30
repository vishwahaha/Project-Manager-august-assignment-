import React from "react";
import { ListItem, ListItemAvatar, Avatar, ListItemText } from "@mui/material";

export const ListSearchItem = (props) => {
    return (
        <ListItem dense>
           <ListItemAvatar>
               {props.avatar === null ?
                (
                    <Avatar>
                        {props.fullName.split(' ').map((item) => item.charAt(0)).join('').toUpperCase()}
                    </Avatar> 
                ) : (
                    <Avatar src={props.avatar}/>
                )
                }
            </ListItemAvatar> 
            <ListItemText primary={props.fullName} secondary={props.enrolmentNumber} />
        </ListItem>
    );
}