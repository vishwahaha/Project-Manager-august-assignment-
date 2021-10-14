import React, { useState, useContext, } from "react";
import { UserContext } from "../../utils/hooks/UserContext";
import { ListSearchItem } from "../CreateProject/ListSearchItem";
import axios from "axios";
import {
    Box,
    Container,
    Typography,
    TextField,
    Autocomplete,
    Button,
    List,
    Chip,
    Avatar,
    Checkbox,
    useMediaQuery,
    FormControlLabel,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { LoadingButton } from "@mui/lab";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { DatePicker } from "@mui/lab";
import { createTheme } from "@mui/material/styles";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

export const EditTitleDescMem = (props) => {

    const { user } = useContext(UserContext);
    const { projectId, listId, cardId } = useParams();
    let history = useHistory();
    
    const [cardTitle, setCardTitle] = useState(props.card.title);
    const [cardDesc, setCardDesc] = useState(props.card.desc);
    const [dueDate, setDueDate] = useState(new Date(props.card.due_date.split("-").reverse().join("-")));
    const [finishedStatus, setFinishedStatus] = useState(props.card.finished_status);
    const [assignees, setAssignees] = useState(props.card.assignees);

    const [dateError, setDateError] = useState(false);
    const [titleError, setTitleError] = useState(false);
    const [reqLoading, setReqLoading] = useState(false);
    const [postError, setPostError] = useState(false);

    const [open, setOpen] = useState(false);
    
    const useStyles = makeStyles({
        scrollBar : {
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
    });

    const myStyles = useStyles();
    const theme = createTheme();
    const isPhone = useMediaQuery(theme.breakpoints.down('sm'));

    const handleSubmit = async(e) => {
        let today = new Date();
        today.setHours(0,0,0,0);
        e.preventDefault();
        if(cardTitle.trim() === ""){
            setTitleError(true);
        }
        else if(dueDate === {} || !(dueDate instanceof Date && !isNaN(dueDate.valueOf())) || dueDate < today){
            setDateError(true);
        }
        else{
            setReqLoading(true);
            const data = {
                title: cardTitle.trim(),
                desc: cardDesc.trim(),
                assignees: assignees.map((assignee) => {
                    return assignee.user_id
                }),
                finished_status: finishedStatus,
                due_date: `${dueDate.getFullYear()}-${dueDate.getMonth() + 1}-${dueDate.getDate()}`,
            }
            return await axios
            .patch(`/project/${projectId}/list/${listId}/card/${cardId}/`, data, { headers: JSON.parse(user), })
            .then((res) => {
                setReqLoading(false);
                setPostError(false);
            })
            .catch((err) => {
                setPostError(true);
                setReqLoading(false);
            })
        }
    }

    return (
        <Container
            disableGutters
            maxWidth="md"
            sx={{
                borderRadius: 5,
                backgroundColor: "white",
                margin: 'auto',
                height: "fit-content",
                display: "flex",
                flexDirection: "column",
                mt: '10%',
            }}
        >
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    pl: 2, 
                    pr: 2, 
                    flexWrap: 'wrap',
                }}
            >
                <Typography
                    variant="h4"
                    align="left"
                    sx={{
                        fontWeight: 600,
                        color: "#828282",
                        m: 1,
                    }}
                >
                    Edit this card
                </Typography>
                <Button endIcon={<ExitToAppIcon />} onClick={() => {history.push(`/project/${projectId}`)}}>
                    Go to project
                </Button>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-start', pl: 2, }}>        
                <FormControlLabel
                    control={
                        <Checkbox 
                            icon={<RadioButtonUncheckedIcon />} 
                            checkedIcon={<CheckCircleIcon />} 
                            checked={finishedStatus}
                            onChange={(e) => {
                                setFinishedStatus(e.target.checked);
                            }}
                        />
                    }
                    label="Finished?"
                    labelPlacement="start"
                />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", p: 5, pb: 0 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: isPhone ? "100%" : "50%",
                            justifyContent: "space-evenly",
                            alignItems: "flex-start",
                        }}
                    >
                        <TextField
                            sx={{
                                width: isPhone ? "100%" : "90%",
                                mt: 1,
                                mb: 1,
                            }}
                            size="small"
                            error={titleError}
                            helperText={
                                titleError
                                    ? "A title is required"
                                    : ""
                            }
                            id="cardTitle"
                            label="Card title"
                            value={cardTitle}
                            onChange={(e) => {
                                setTitleError(false);
                                setPostError(false);
                                setCardTitle(e.target.value);
                            }}
                            autoComplete="off"
                        />
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Due date"
                                    inputFormat="dd-MM-yyyy"
                                    format="DD-MM-YYYY"
                                    mask="__-__-____"
                                    value={dueDate}
                                    minDate={new Date()}
                                    onChange={date => {setDueDate(date); setDateError(false)}}
                                    renderInput={(params) => <TextField 
                                                                {...params} 
                                                                error={dateError} 
                                                                size="small" 
                                                                helperText={dateError ? "Due date is required and should be in correct format" : ""}
                                                                sx={{ width: isPhone ? '100%' : '90%', mt: 1, mb: 1, }}
                                                            />}
                                />
                            </LocalizationProvider>
                        <Autocomplete
                            multiple
                            fullWidth
                            id="select-assigneez"
                            open={open}
                            sx={{
                                width: isPhone ? "100%" : "90%",
                                mt: 1,
                                mb: 2,
                            }}
                            onOpen={() => {
                                setOpen(true);
                            }}
                            onClose={() => {
                                setOpen(false);
                            }}
                            ListboxComponent={List}
                            ListboxProps={{
                                className: myStyles.scrollBar,
                            }}
                            options={props.card.project_members}
                            disableCloseOnSelect
                            isOptionEqualToValue={(option, value) =>
                                option.user_id === value.user_id
                            }
                            getOptionLabel={(option) => {
                                return (
                                    option.full_name +
                                    "," +
                                    option.enrolment_number
                                );
                            }}
                            renderOption={(props, option, { selected }) => (
                                <div {...props}>
                                    <Checkbox
                                        icon={
                                            <CheckBoxOutlineBlankIcon fontSize="small" />
                                        }
                                        checkedIcon={
                                            <CheckBoxIcon fontSize="small" />
                                        }
                                        style={{ marginRight: 8 }}
                                        checked={selected}
                                    />
                                    <ListSearchItem
                                        avatar={option.display_picture}
                                        fullName={option.full_name}
                                        enrolmentNumber={
                                            option.enrolment_number
                                        }
                                    />
                                </div>
                            )}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => {
                                    return (
                                        <Chip
                                            {...getTagProps({ index })}
                                            avatar={
                                                option.display_picture ===
                                                null ? (
                                                    <Avatar>
                                                        {option.full_name
                                                            .split(" ")
                                                            .map((item) =>
                                                                item.charAt(0)
                                                            )
                                                            .join("")
                                                            .toUpperCase()}
                                                    </Avatar>
                                                ) : (
                                                    <Avatar
                                                        src={
                                                            option.display_picture
                                                        }
                                                    />
                                                )
                                            }
                                            label={
                                                option.full_name +
                                                ", " +
                                                option.enrolment_number
                                            }
                                        />
                                    );
                                })
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Card assignees"
                                    placeholder="Select card assignees..."
                                />
                            )}
                            value={assignees}
                            onChange={(e, newVal) => {
                                setAssignees([...newVal]);
                            }}
                        />
                    </Box>
                    <Box sx={{ width: isPhone ? "100%" : "50%", display: 'flex', alignItems: 'center', }}>
                        <TextField
                            sx={{ width: "100%" }}
                            multiline
                            rows={6}
                            id="cardDesc"
                            label="Description of this card"
                            value={cardDesc}
                            onChange={(e) => {
                                setCardDesc(e.target.value);
                            }}
                            autoComplete="off"
                        />
                    </Box>
                </Box>
                {postError &&
                    <Typography color="error">
                        Some error occurred. Check if all the fields are filled correctly.
                    </Typography>
                }
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mt: 4,
                        mb: 2,
                    }}
                >
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        sx={{ boxShadow: "none" }}
                        onClick={handleSubmit}
                        loading={reqLoading}
                    >
                        Save
                    </LoadingButton>
                </Box>
            </Box>
        </Container>
    );
};