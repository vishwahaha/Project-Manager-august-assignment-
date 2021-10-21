import React, { useState, useContext } from "react";
import { UserContext } from "../../utils/hooks/UserContext";
import { StrAvatar } from "../../utils/StrAvatar";
import { ListSearchItem } from "../CreateProject/ListSearchItem";
import axios from "axios";
import {
    Modal,
    Box,
    Container,
    IconButton,
    Typography,
    TextField,
    Autocomplete,
    List,
    Chip,
    Checkbox,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { LoadingButton } from "@mui/lab";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { DatePicker } from "@mui/lab";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';


export const CreateCardModal = (props) => {
    const { user } = useContext(UserContext);

    const [cardTitle, setCardTitle] = useState("");
    const [titleError, setTitleError] = useState(false);

    const [cardDesc, setCardDesc] = useState("");
    const [dueDate, setDueDate] = useState({});
    const [dateError, setDateError] = useState(false);

    const [reqLoading, setReqLoading] = useState(false);
    const [postError, setPostError] = useState(false);

    //for autocomplete
    const [open, setOpen] = useState(false);
    const [assignees, setAssignees] = useState([]);

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
                due_date: `${dueDate.getFullYear()}-${dueDate.getMonth() + 1}-${dueDate.getDate()}`,
            } 
            return await axios
            .post(`/project/${props.projectId}/list/${props.listId}/card/`, data, { headers: JSON.parse(user) })
            .then((res) => {
                if(res.status === 201){
                    setReqLoading(false);
                    setCardTitle("");
                    setCardDesc("");
                    setAssignees([]);
                    props.updateDOM();
                    props.close();
                }
                else{
                    setReqLoading(false);
                    setPostError(true);
                }
            })
            .catch((err) => {
                setReqLoading(false);
                setPostError(true);
            });
        }
    }
    
    const theme = useTheme();
    const isPhone = useMediaQuery(theme.breakpoints.down('sm'));

    const useStyles = makeStyles({
        scrollBar : {
            "&::-webkit-scrollbar": {
                width: "7px",
                height: "7px",
            },
            "&::-webkit-scrollbar-thumb": {
                backgroundColor: theme.palette.primary.main,
            },
        },
    });

    const myStyles = useStyles();

    return (
        <Modal open={props.open}>
            <Container
                disableGutters
                maxWidth="md"
                sx={{
                    borderRadius: 5,
                    backgroundColor: theme.palette.background.paper,
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    height: "fit-content",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <IconButton
                    color="error"
                    onClick={props.close}
                    sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                    }}
                    disabled={reqLoading}
                >
                    <CancelIcon fontSize="large" />
                </IconButton>
                <Typography
                    variant="h4"
                    align="center"
                    color="text.disabled"
                    sx={{
                        fontWeight: 600,
                        m: 1,
                    }}
                >
                    Create a card
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", p: 5, pb: 0, }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', }}>
                        <Box 
                            sx={{ 
                                display: "flex", 
                                flexDirection: "column", 
                                width: isPhone ? '100%' : '50%', 
                                justifyContent: 'space-evenly', 
                                alignItems: 'center',
                            }}
                        >
                            <TextField
                                sx={{ width: isPhone ? '100%' : '90%', mt: 1, mb: 1, }}
                                error={titleError}
                                helperText={
                                    titleError ? "A title is required" :  ""
                                }
                                size="small"
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
                                sx={{ width: isPhone ? '100%' : '90%', mt: 1, mb: 2, }}
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
                                options={props.members}
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
                                                avatar={<StrAvatar data={option} />}
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
                        <Box sx={{ width: isPhone ? '100%' : '50%', display: 'flex', alignItems: 'center', }}>
                            <TextField
                                sx={{ width: '100%',}}
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
                            sx={{ boxShadow: 'none', }} 
                            onClick={handleSubmit} 
                            loading={reqLoading}
                        >
                            Create card
                        </LoadingButton>
                    </Box>
                </Box>
            </Container>
        </Modal>
    );
};
