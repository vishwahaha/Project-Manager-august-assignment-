import React, { useContext, useEffect, useState } from "react";
import { Box, Container, Tab, Tabs, } from "@mui/material";
import PropTypes from "prop-types";
import { UserContext } from "../../utils/hooks/UserContext";
import { HomeCards } from "./HomeCards";
import axios from "axios";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`home-tabpanel-${index}`}
            aria-labelledby={`home-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 3, pb: 3, }}>
                   {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `home-tab-${index}`,
        "aria-controls": `home-tabpanel-${index}`,
    };
}


export const Home = () => {

    const { user } = useContext(UserContext);

    const [projMsg, setMsg] = useState(null);
    const [finishedProjects, setFinishedProjects] = useState("initial");
    const [ongoingProjects, setOngoingProjects] = useState("initial");

    const [noFP, setFP] = useState(false);
    const [noOP, setOP] = useState(false);

    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        async function getProjectDetails() {
            return await axios
                .get("/project/", { headers: JSON.parse(user) })
                .then(async (res) => {
                    if (res.status === 200) {
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
    }, [user]);

    useEffect(() => {
        if (ongoingProjects.length === 0) {
            setOP(true);
        }
    }, [ongoingProjects]);

    useEffect(() => {
        if (finishedProjects.length === 0) {
            setFP(true);
        }
    }, [finishedProjects]);

    const threePlaceholders = [0, 0, 0];
    const fourPlaceholders = [0, 0, 0, 0];

    return (
        <Container maxWidth="lg" sx={{  }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                >
                    <Tab label="Ongoing projects" {...a11yProps(0)} />
                    <Tab label="Finished projects" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <HomeCards
                    cards={ongoingProjects}
                    noCards={noOP}
                    noCardMessage="No ongoing projects"
                    projMsg={projMsg}
                    placeholder={fourPlaceholders}
                />
            </TabPanel>

            <TabPanel value={value} index={1}>
                <HomeCards
                    cards={finishedProjects}
                    noCards={noFP}
                    noCardMessage="No finished projects"
                    projMsg={projMsg}
                    placeholder={threePlaceholders}
                />
            </TabPanel>
        </Container>
    );
};
