import { CircularProgress } from "@mui/material";

export const Loading = () => {
    return (
        <div className="loading-login-spinner">
            <div>
                <CircularProgress color="primary" size="5rem" />
            </div>
        </div>
    );
}