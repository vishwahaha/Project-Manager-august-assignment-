import React, { useState } from "react";
import { Box, Grid, Typography, TextField, InputAdornment, useTheme } from "@mui/material";
import { ProjectCard } from "./ProjectCard";
import { ProjectCardPlaceholder } from "./ProjectCardPlaceholder";
import SearchIcon from '@mui/icons-material/Search';


export const HomeCards = (props) => {

    const [search, setSearch] = useState("");
    
    const theme = useTheme();

    const handleSearch = (e) => {
        setSearch(e.target.value);
    }

    const filteredCards = search.length === 0 ? props.cards
    : props.cards.filter(card => card.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <Box>
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
            {props.cards !== "initial" &&
            <TextField 
                size="small" 
                label="Search projects"
                value={search}
                onChange={handleSearch}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />
            }
            </Box>
            <Grid container spacing={1} sx={{ margin: "auto", pl: 3, pr: 3 }}>
                {props.noCards ? (
                    <Typography
                        variant="h3"
                        align="center"
                        sx={{ margin: 5, color: theme.palette.text.secondary }}
                    >
                        {props.projMsg == null ? props.noCardMessage : props.projMsg}
                    </Typography>
                ) : props.cards === "initial" ? (
                    props.placeholder.map((itr, index) => {
                        return (
                            <Grid item key={index} xs={12} md={4} lg={3}>
                                <ProjectCardPlaceholder />
                            </Grid>
                        );
                    })
                ) : (
                    filteredCards.map((project, index) => {
                        return (
                            <Grid item key={index} xs={12} md={4} lg={3}>
                                <ProjectCard
                                    projectId={project.id}
                                    creator={project.creator.full_name}
                                    title={project.name}
                                    description={project.wiki}
                                    finishedStatus={project.finished_status}
                                />
                            </Grid>
                        );
                    })
                )}
            </Grid>
        </Box>
    );
};
