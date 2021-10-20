import React, { useState, useEffect, useContext } from "react";
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    useMediaQuery,
    Autocomplete,
    Checkbox,
    List,
    Chip,
    Avatar,
    Backdrop,
    CircularProgress,
    useTheme
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
//For rich text field.
import ReactQuill from "react-quill";
import { ListSearchItem } from "./ListSearchItem";
import { NotAllowed } from "../NotAllowed";
import { UserContext, UserData } from "../../utils/hooks/UserContext";
import EditorToolbar, { modules, formats } from "../../utils/EditorToolbar";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useHistory } from "react-router-dom";

export const CreateProject = () => {

    const { user } = useContext(UserContext);
    const { userData } = useContext(UserData);
    let history = useHistory();

    //Form control states
    const [projectName, setName] = useState("");
    const [wiki, setWiki] = useState("");
    const [members, setMembers] = useState([userData]);
    const [nameError, setError] = useState(false);
    const [postError, setPostError] = useState(false);

    //Member list fetching states
    const [open, setOpen] = useState(false);
    const [memberList, setList] = useState([]);
    const loading = open && memberList.length === 0;

    //State for backdrop
    const [submitted, setSubmitted] = useState(false);

    const theme = useTheme();
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
                        setList(
                            res.data.filter((person, index) => {
                                if (person.user_id !== userData.user_id) {
                                    return person;
                                }
                            })
                        );
                    }
                });
        }
        getUsers();
    }, [loading, user, userData]);

    async function handleSubmit(e) {
        e.preventDefault();
        if (projectName.trim().length === 0) {
            setError(true);
        } else {
            setSubmitted(true);
            let valName = projectName.trim();
            let valWiki = wiki.trim();
            let valMembers = members.map((person) => {
                return person.user_id;
            });
            const data = {
                members: valMembers,
                name: valName,
                wiki: valWiki,
            };
            return await axios
                .post("/project/", data, { headers: JSON.parse(user) })
                .then((res) => {
                    if (res.status === 201) {
                        history.push("/home");
                    } else {
                        setSubmitted(false);
                        setPostError(true);
                    }
                })
                .catch((err) => {
                    setSubmitted(false);
                    setPostError(true);
                    console.log(err);
                });
        }
    }

    theme.typography.h3 = {
        ...theme.typography.h3,
        fontSize: "3rem",
        [theme.breakpoints.down("sm")]: {
            fontSize: "2rem",
        },
    };

    const useStyles = makeStyles({
        scrollBar: {
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

    if(userData.is_disabled){
        return <NotAllowed />
    }

    else
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
                maxWidth="md"
                sx={{
                    height: "fit-content",
                    margin: "auto",
                    borderRadius: 5,
                    mt: "5%",
                    backgroundColor: theme.palette.background.paper,
                    padding: "1%",
                    overflowX: "hidden",
                    overflowY: "auto",
                }}
                className={myStyles.scrollBar}
            >
                <Typography
                    variant="h3"
                    sx={{ color: theme.palette.text.disabled, fontWeight: 500 }}
                >
                    Create a new project:
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <form>
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "space-between",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-evenly",
                                    flexGrow: 1,
                                    alignItems: isPhone
                                        ? "center"
                                        : "flex-start",
                                }}
                            >
                                <TextField
                                    error={nameError}
                                    helperText={
                                        nameError
                                            ? "Every great project needs a name!"
                                            : ""
                                    }
                                    id="projectName"
                                    label="Project Name"
                                    value={projectName}
                                    onChange={(e) => {
                                        setError(false);
                                        setName(e.target.value);
                                    }}
                                    sx={{ width: 330 }}
                                    autoComplete="off"
                                />
                                <Autocomplete
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
                                            if (option === userData) {
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
                                            }
                                            return (
                                                <Chip
                                                    {...getTagProps({ index })}
                                                    avatar={
                                                        option.display_picture ===
                                                        null ? (
                                                            <Avatar>
                                                                {option.full_name
                                                                    .split(" ")
                                                                    .map(
                                                                        (
                                                                            item
                                                                        ) =>
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
                                    style={{ width: 330, marginTop: 20 }}
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
                                            userData,
                                            ...newVal.filter((option, idx) => {
                                                if (option !== userData) {
                                                    return option;
                                                }
                                            }),
                                        ]);
                                    }}
                                />
                            </Box>
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    display: "flex",
                                    justifyContent: isPhone
                                        ? "center"
                                        : "flex-end",
                                }}
                            >
                                {isPhone ? (
                                    <Box sx={{ mt: 3, mb: 3, width: 330 }}>
                                        <TextField
                                            fullWidth
                                            label="Something about your project..."
                                            multiline
                                            rows={6}
                                            value={wiki}
                                            onChange={(e) =>
                                                setWiki(e.target.value)
                                            }
                                        />
                                    </Box>
                                ) : (
                                    <Box width={500}>
                                        <Box sx={{ mt: 3, mb: 3, zIndex: 999, }}>
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
                                )}
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: isPhone ? "center" : "flex-end",
                            }}
                        >
                            <Button
                                type="submit"
                                variant="text"
                                color="primary"
                                onClick={handleSubmit}
                                sx={{
                                    textTransform: "none",
                                    fontSize: 21,
                                    fontWeight: 700,
                                }}
                            >
                                Create project!
                            </Button>
                        </Box>
                    </form>
                    <Typography
                        textAlign="center"
                        color="error"
                        sx={{ display: postError ? "initial" : "none" }}
                    >
                        Some error occurred.
                    </Typography>
                </Box>
            </Container>
        </div>
    );
};
