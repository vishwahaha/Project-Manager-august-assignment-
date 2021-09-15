import CircularProgress from "@material-ui/core/CircularProgress";

export const Loading = () => {
    return (
        <div className="login-spinner">
            <div>
                <CircularProgress color="primary" size="5rem" />
            </div>
        </div>
    );
}