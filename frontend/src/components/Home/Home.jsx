import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Typography, Stack } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';

import { UserContext } from "../../utils/hooks/UserContext";
import { ProjectCard } from "./ProjectCard";
import { ProjectCardPlaceholder } from "./ProjectCardPlaceholder";
import axios from "axios";
import { Link } from "react-router-dom";

export const Home = () => {
  const { user } = useContext(UserContext);
  const [projMsg, setMsg] = useState(null);
  const [finishedProjects, setFinishedProjects] = useState("initial");
  const [ongoingProjects, setOngoingProjects] = useState("initial");
  const [noFP, setFP] = useState(false);
  const [noOP, setOP] = useState(false);

  useEffect(() => {
    async function getProjectDetails() {
      return await axios
        .get("/project/", { headers: JSON.parse(user) })
        .then(async (res) => {
          if (res.status === 200) {
            console.log(res.data);
            setOngoingProjects(
              res.data.filter((project) => {
                if (!project.finished_status) {
                  return project;
                }
              })
            );
            setFinishedProjects(
              res.data.filter((project) => {
                if (project.finished_status) {
                  return project;
                }
              })
            );
          } else {
            setMsg("Some error occurred. Please try again");
          }
        })
        .catch((err) => {
          setMsg(err);
        });
    }
    getProjectDetails();
  }, []);

  useEffect(() => {
    if (ongoingProjects.length == 0) {
      setOP(true);
    }
  }, [ongoingProjects]);

  useEffect(() => {
    if (finishedProjects.length == 0) {
      setFP(true);
    }
  }, [finishedProjects]);

  console.log(ongoingProjects);
  console.log(user);  
  const threePlaceholders = [0, 0, 0];
  const fourPlaceholders = [0, 0, 0, 0];

  const useStyles = makeStyles({
    horizontalScroll: {
      overflowX: "auto",
      height: "fit-content",
      maxHeight: 230,
      borderRadius: 10,
      "&::-webkit-scrollbar": {
        width: "7px",
        height: "7px",
        backgroundColor: "#F5F5F5",
      },
      "&::-webkit-scrollbar-track": {
        "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.3)",
        backgroundColor: "#F5F5F5",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#6956C9",
      },
    },
    gridContainer: {
      padding: 25,
      margin: 10,
    },
  });

  const myStyles = useStyles();

  return (
    <Box>
      <Box className={myStyles.gridContainer}>
        {noOP ? (
          <Typography variant="h3" align="center" sx={{ margin: 5, color: '#757575',}}>
            {projMsg == null ? 'No ongoing projects.' : projMsg}
          </Typography>
        ) : (
          <Stack
            spacing={2}
            overflow={false}
            direction="row"
            className={myStyles.horizontalScroll}
            alignItems="flex-start"
          >
              {ongoingProjects == "initial"
                ? fourPlaceholders.map((itr, index) => {
                  return (
                    <ProjectCardPlaceholder key={index} />
                  );
                })
                : ongoingProjects.map((project, index) => {
                    return (
                      <ProjectCard
                        key={index}
                        creator={project.creator.full_name}
                        title={project.name}
                        description={project.wiki}
                        finishedStatus={project.finished_status}
                      />
                    );
                  })}  
          </Stack>
        )}
      </Box>

      <Box sx={{display: 'flex', justifyContent: 'center', padding: 5,}}>
        <Button variant="outlined" sx={{ textTransform: 'none', }} color="success" endIcon={<CreateNewFolderIcon />}>
          <Typography variant="h5">
            <Link style={{ all: 'inherit', }} to="/create_project">Add a new project</Link>
          </Typography>
        </Button>
      </Box>

      <Box className={myStyles.gridContainer}>
        {noFP ? (
          <Typography variant="h3" align="center" sx={{ margin: 5, color: '#757575',}}>
            {projMsg == null ? 'No finished projects.' : projMsg}
          </Typography>
        ) : (
          <Stack
            spacing={2}
            overflow={false}
            direction="row"
            className={myStyles.horizontalScroll}
            alignItems="flex-start"
          >
              {finishedProjects == "initial"
                ? threePlaceholders.map((itr, index) => {
                  return (
                    <ProjectCardPlaceholder key={index} />
                  );
                })
                : finishedProjects.map((project, index) => {
                    return (
                      <ProjectCard
                        key={index}
                        creator={project.creator.full_name}
                        title={project.name}
                        description={project.wiki}
                        finishedStatus={project.finished_status}
                      />
                    );
                  })}
          </Stack>
        )}
      </Box>
    </Box>
  );
};
