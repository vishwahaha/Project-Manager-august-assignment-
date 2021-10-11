import React from "react";
import {
    Dialog,
    DialogActions,
    DialogTitle,
    Button,
} from "@mui/material";

export const ListDelDialog = (props) => {

    return (
        <Dialog
            open={props.dialogOpen}
            onClose={props.dialogClose}
        >
            <DialogTitle id="dialog-title">
                {"Do you surely want to proceed with this action?"}
            </DialogTitle>
            <DialogActions>
                <Button color="success" onClick={() => {props.deleteList()}}>Yes</Button>
                <Button color="error" onClick={props.dialogClose} autoFocus>
                    No
                </Button>
            </DialogActions>
        </Dialog>
    );
};
