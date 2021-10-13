import React, { useState } from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

export const SearchBar = (props) => {

    const [value, setValue] = useState("");
    
    const handleChange = (e) => {
        setValue(e.target.value);
    }

    return (
        <TextField 
            size="small" 
            label="Search projects"
            value={value}
            onChange={handleChange}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <SearchIcon />
                    </InputAdornment>
                ),
            }}
        />
    );
}
