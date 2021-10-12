import React from "react";
import { Card, CardContent, Typography, CardActions, Chip, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useHistory } from "react-router-dom";
import DOMPurify from 'dompurify';

export const ProjectCard = (props) => {

  let history = useHistory();
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
    cardHover :{
      '&:hover':{
        backgroundColor: '#f5f5f5',
        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
        borderColor: '#f5f5f5',
      },
    },
  });

  const myStyles = useStyles();

  function handleClick(){
    history.push('/project/'+ props.projectId);
  }

  return (
    <Box className={myStyles.limitHeight}>
      <Card 
        variant="outlined" 
        sx={{ backgroundColor: '#f2f2f2', borderRadius: 5, borderColor: '#b0b0b0', width: 260, m: 'auto',  }}
        onClick={handleClick}
        className={myStyles.cardHover}
      >
        <CardContent>
          <Typography variant="h6" noWrap component="div">
            {props.title}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Leader: {props.creator}
          </Typography>
          {/* <Typography className={myStyles.multiLineEllipsis} variant="body2"> */}
            <div
              dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(props.description)}} 
              style={{ overflow: 'hidden', maxHeight: 60, }}
            >
            </div>
          {/* </Typography> */}
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
