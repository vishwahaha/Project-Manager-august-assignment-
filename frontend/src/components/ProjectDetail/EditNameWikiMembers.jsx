import React, { useState, useContext, useEffect } from "react";
import {
    Container,
    Box,
    TextField,
    Autocomplete,
    Chip,
    Avatar,
    Button,
    Typography,
    useMediaQuery,
    List,
    Checkbox,
    Backdrop,
    CircularProgress,
    FormControlLabel,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { createTheme } from "@mui/material/styles";
import { UserContext, UserData } from "../../utils/hooks/UserContext";
import ReactQuill from "react-quill";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import EditorToolbar, { modules, formats } from "../../utils/EditorToolbar";
import { ListSearchItem } from "../CreateProject/ListSearchItem";
import axios from "axios";

export const EditNameWikiMembers = (props) => {
    const { user } = useContext(UserContext);
    const { userData } = useContext(UserData);

    const [projectName, setName] = useState(props.project.name);
    const [wiki, setWiki] = useState(props.project.wiki);
    const [members, setMembers] = useState(props.project.members);
    const [projectStatus, setProjectStatus] = useState(
        props.project.finished_status
    );

    const [nameError, setNameError] = useState(false);
    const [postError, setPostError] = useState(false);

    const [open, setOpen] = useState(false);
    const [memberList, setList] = useState([]);
    const loading = open && memberList.length === 0;

    const [submitted, setSubmitted] = useState(false);

    const theme = createTheme();
    const isPhone = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        if (!loading) {
            return undefined;
        }
        async function getUsers() {
            return await axios
                .get("/user/", { headers: JSON.parse(user) })
                .then((res) => {
                    if (res.status === 200) {
                        setList(res.data);
                    }
                });
        }
        getUsers();
    }, [loading, user, userData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (projectName.trim() === "") {
            setNameError(true);
        } else {
            setSubmitted(true);

            const data = {
                name: projectName.trim(),
                wiki: wiki.trim(),
                members: members.map((member) => {
                    return member.user_id;
                }),
                finished_status: projectStatus,
            };
            return await axios
                .patch(`/project/${props.project.id}/`, data, {
                    headers: JSON.parse(user),
                })
                .then((res) => {
                    if (res.status === 200) {
                        setPostError(false);
                        setSubmitted(false);
                    } else {
                        setPostError(true);
                        setSubmitted(false);
                    }
                })
                .catch((err) => {
                    setPostError(true);
                    setSubmitted(false);
                    console.log(err);
                });
        }
    };

    const useStyles = makeStyles({
        scrollBar: {
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
    return (
        <div>
            <Backdrop
                sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={submitted}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Container
                maxWidth="lg"
                sx={{
                    height: "fit-content",
                    margin: "auto",
                    borderRadius: 5,
                    backgroundColor: "white",
                    padding: "1%",
                    overflowX: "hidden",
                    overflowY: "auto",
                }}
                className={myStyles.scrollBar}
            >
                <Box sx={{ mt: 2 }}>
                    <form>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                flexWrap: "wrap",
                                justifyContent: "space-between",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: isPhone
                                        ? "center"
                                        : "space-between",
                                    flexGrow: 1,
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                }}
                            >
                                <TextField
                                    sx={{ width: isPhone ? "90%" : "30%" }}
                                    error={nameError}
                                    helperText={
                                        nameError ? "Name cannot be blank" : ""
                                    }
                                    id="projectName"
                                    label="Project Name"
                                    value={projectName}
                                    onChange={(e) => {
                                        setNameError(false);
                                        setName(e.target.value);
                                    }}
                                    autoComplete="off"
                                />
                                <Autocomplete
                                    sx={{
                                        width: isPhone ? "90%" : "60%",
                                        mt: isPhone ? 2 : "none",
                                    }}
                                    multiple
                                    fullWidth
                                    id="select-memberz"
                                    open={open}
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
                                    options={memberList}
                                    loading={loading}
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
                                    renderOption={(
                                        props,
                                        option,
                                        { selected }
                                    ) => (
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
                                            if (
                                                option.user_id ===
                                                props.project.creator.user_id
                                            ) {
                                                return (
                                                    <Chip
                                                        key={index}
                                                        avatar={
                                                            option.display_picture ===
                                                            null ? (
                                                                <Avatar>
                                                                    {option.full_name
                                                                        .split(
                                                                            " "
                                                                        )
                                                                        .map(
                                                                            (
                                                                                item
                                                                            ) =>
                                                                                item.charAt(
                                                                                    0
                                                                                )
                                                                        )
                                                                        .join(
                                                                            ""
                                                                        )
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
                                            } else {
                                                return (
                                                    <Chip
                                                        {...getTagProps({
                                                            index,
                                                        })}
                                                        avatar={
                                                            option.display_picture ===
                                                            null ? (
                                                                <Avatar>
                                                                    {option.full_name
                                                                        .split(
                                                                            " "
                                                                        )
                                                                        .map(
                                                                            (
                                                                                item
                                                                            ) =>
                                                                                item.charAt(
                                                                                    0
                                                                                )
                                                                        )
                                                                        .join(
                                                                            ""
                                                                        )
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
                                            }
                                        })
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Project members"
                                            placeholder="Select project members.."
                                        />
                                    )}
                                    value={members}
                                    onChange={(e, newVal) => {
                                        setMembers([
                                            props.project.creator,
                                            ...newVal.filter((option, idx) => {
                                                if (
                                                    option.user_id !==
                                                    props.project.creator
                                                        .user_id
                                                ) {
                                                    return option;
                                                }
                                            }),
                                        ]);
                                    }}
                                />
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                }}
                            >
                                <FormControlLabel
                                    sx={{ margin: 0 }}
                                    value="project_status"
                                    control={
                                        <Checkbox
                                            checked={projectStatus}
                                            onChange={(e) => {
                                                setProjectStatus(
                                                    e.target.checked
                                                );
                                            }}
                                        />
                                    }
                                    label="Is this project finished?"
                                    labelPlacement="start"
                                />
                            </Box>
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    display: "flex",
                                }}
                            >
                                <Box width="100%" sx={{ mt: 3, zIndex: 999 }}>
                                    <EditorToolbar />
                                    <ReactQuill
                                        theme="snow"
                                        value={wiki}
                                        onChange={setWiki}
                                        placeholder={
                                            "Something about your project..."
                                        }
                                        modules={modules}
                                        formats={formats}
                                    />
                                </Box>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Button
                                type="submit"
                                onClick={handleSubmit}
                                sx={{
                                    textTransform: "none",
                                    fontSize: 21,
                                    fontWeight: 700,
                                }}
                            >
                                Save
                            </Button>
                        </Box>
                    </form>
                    <Typography
                        textAlign="center"
                        color="red"
                        sx={{ display: postError ? "initial" : "none" }}
                    >
                        Some error occurred.
                    </Typography>
                </Box>
            </Container>
        </div>
    );
};
