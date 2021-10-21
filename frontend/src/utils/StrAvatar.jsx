import { Avatar } from "@mui/material";


export const StrAvatar = (props) => {

    function stringToColor(string) {
        let hash = 0;
        let i;
    
        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
    
        let color = "#";
    
        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.substr(-2);
        }
        /* eslint-enable no-bitwise */
        return color;
    }

    function isDark(bgColor) {
        let color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
        let r = parseInt(color.substring(0, 2), 16); // hexToR
        let g = parseInt(color.substring(2, 4), 16); // hexToG
        let b = parseInt(color.substring(4, 6), 16); // hexToB
        return (((r * 0.299) + (g * 0.587) + (b * 0.114)) > 186) ? false : true;
    }
    
    function stringAvatar(name) {
        return {
            sx: {
                bgcolor: stringToColor(name),
                ...props.sx,
            },
            children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
            style: {
                color: isDark(stringToColor(name)) ? 'white' : 'black',
            }
        };
    }

    if(props.data.display_picture){
        return <Avatar {...props} sx={props.sx} src={props.data.display_picture}/>
    }
    else {
        return <Avatar {...props} {...stringAvatar(props.data.full_name)}/>
    }
}   
