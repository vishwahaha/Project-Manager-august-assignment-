import React, { useState, useEffect, useContext } from "react";
import { UserData, UserContext } from "../../utils/hooks/UserContext";
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
    Button,
    List,
    Chip,
    Avatar,
    Checkbox,
    useMediaQuery,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { LoadingButton } from "@mui/lab";
import { createTheme } from "@mui/material/styles";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';


export const CreateCardModal = (props) => {
    const { user } = useContext(UserContext);

    const [cardTitle, setCardTitle] = useState("");
    const [titleError, setTitleError] = useState(false);

    const [cardDesc, setCardDesc] = useState("");

    const [reqLoading, setReqLoading] = useState(false);
    const [postError, setPostError] = useState(false);

    //for autocomplete
    const [open, setOpen] = useState(false);
    const [assignees, setAssignees] = useState([]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        if(cardTitle.trim() === ""){
            setTitleError(true);
        }
        else{
            setReqLoading(true);
            const data = {
                title: cardTitle.trim(),
                desc: cardDesc.trim(),
                assignees: assignees.map((assignee) => {
                    return assignee.user_id
                }),
            } 
            return await axios
            .post(`/project/${props.projectId}/list/${props.listId}/card/`, data, { headers: JSON.parse(user) })
            .then((res) => {
                console.log(res);
                if(res.status === 201){
                    setReqLoading(false);
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
                console.log(err);
            });
        }
    }

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

    return (
        <Modal open={props.open}>
            <Container
                disableGutters
                maxWidth="md"
                sx={{
                    borderRadius: 5,
                    backgroundColor: "white",
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
                    sx={{
                        fontWeight: 600,
                        color: "#828282",
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
                                    titleError ? "A title is required" : postError ? "Some error occured" : ""
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
                                                avatar={
                                                    option.display_picture ===
                                                    null ? (
                                                        <Avatar>
                                                            {option.full_name
                                                                .split(" ")
                                                                .map((item) =>
                                                                    item.charAt(
                                                                        0
                                                                    )
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
                        <Box sx={{ width: isPhone ? '100%' : '50%', }}>
                            <TextField
                                sx={{ width: '100%', }}
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
