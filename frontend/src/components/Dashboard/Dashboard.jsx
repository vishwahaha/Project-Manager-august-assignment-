import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { Container, Box, Tab, Tabs, Grid, } from "@mui/material";
import { DashCard } from "./DashCard";
import { Loading } from "../Login/Loading";
import { UserContext } from "../../utils/hooks/UserContext";
import axios from "axios";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`db-tabpanel-${index}`}
            aria-labelledby={`db-tab-${index}`}
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
        id: `db-tab-${index}`,
        "aria-controls": `db-tabpanel-${index}`,
    };
}

export const Dashboard = () => {

    const { user } = useContext(UserContext);

    const [value, setValue] = useState(0);
    const [loading, setLoading] = useState(true);

    const [pendingCards, setPendingCards] = useState([]);
    const [finishedCards, setFinishedCards] = useState([]);

    useEffect(() => {
        async function getCards(){
            return await axios
            .get('/dashboard', { headers: JSON.parse(user), })
            .then((res) => {
                if(res.status === 200){
                    console.log(res.data);
                    setPendingCards(res.data.filter((card) => {
                        return card.finished_status === false;
                    }));
                    setFinishedCards(res.data.filter((card) => {
                        return card.finished_status === true;
                    }))
                    setLoading(false);
                }
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
        }
        getCards();
    }, [user]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    if(loading){
        return <Loading />
    }

    else
    return (
        <Container maxWidth="lg" sx={{  }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                >
                    <Tab label="Pending cards" {...a11yProps(0)} />
                    <Tab label="Finished cards" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>

                <Grid container spacing={1} sx={{ margin: 'auto', pl: 3, pr:3, }}>
                    {pendingCards.map((card, idx) => {
                        return <Grid item key={idx} xs={12} md={4} lg={3}>
                            <DashCard
                                    project={card.project}
                                    listId={card.list}
                                    cardId={card.id}
                                    title={card.title}
                                    creator={card.creator}
                                    desc={card.desc}
                                    dueDate={card.due_date}
                                    finishedStatus={card.finished_status}
                                />
                                </Grid>
                    })
                    }
                </Grid>
            </TabPanel>

            <TabPanel value={value} index={1}>
            <Grid container spacing={1} sx={{ margin: 'auto', pl: 3, pr:3, }}>
                    {finishedCards.map((card, idx) => {
                        return <Grid item key={idx} xs={12} md={4} lg={3}>
                            <DashCard
                                    project={card.project}
                                    listId={card.list}
                                    cardId={card.id}
                                    title={card.title}
                                    creator={card.creator}
                                    desc={card.desc}
                                    dueDate={card.due_date}
                                    finishedStatus={card.finished_status}
                                />
                                </Grid>
                    })
                    }
                </Grid>
            </TabPanel>
        </Container>
    );
};
