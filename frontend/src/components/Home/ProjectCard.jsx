import React from "react";
import { Card, CardContent, Typography, CardActions, Chip, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";

export const ProjectCard = (props) => {

  const useStyles = makeStyles({
    multiLineEllipsis: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      "-webkit-line-clamp": 3,
      "-webkit-box-orient": "vertical"
    },
    finishedChip: {
      backgroundColor: '#a8eda6',
    },
    ongoingChip: {
      backgroundColor: '#ff7d7d',
    },
    limitHeight: {
      maxHeight: 225,
      cursor: 'pointer',
    },
  });

  const myStyles = useStyles();

  return (
    <Box className={myStyles.limitHeight}>
      <Card variant="outlined" sx={{ backgroundColor: '#e8e8e8', borderRadius: 5, borderColor: '#b0b0b0', width: 260, }}>
        <CardContent>
          <Typography variant="h6" noWrap component="div">
            {props.title}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Leader: {props.creator}
          </Typography>
          <Typography className={myStyles.multiLineEllipsis} variant="body2">
            {props.description}
          </Typography>
        </CardContent>
        <CardActions>
          <Chip
           label={props.finishedStatus ? "Finished" : "Ongoing" } 
           className={props.finishedStatus ? myStyles.finishedChip : myStyles.ongoingChip} 
           sx={{ cursor: 'pointer', }}
          />
        </CardActions>
      </Card>
    </Box>
  );
};
