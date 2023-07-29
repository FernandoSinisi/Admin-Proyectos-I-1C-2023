import {useNavigate} from "react-router-dom"
import {useSession} from '../auth/auth';
import {Button, IconButton} from "@mui/material";
import React, {useEffect, useState} from "react";
import LogoutIcon from '@mui/icons-material/Logout';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import imgLogo from "../img/CuidaLaCasa.PNG"

export default function NavBar() {
    const navigate = useNavigate();
    const session = useSession();
    const [role, setRole] = useState("");

    useEffect(() => {
        setRole(session.role);
    }, [role, setRole]);

    const redirectHome = () => navigate("/");
    const redirectChat = () => navigate("/chat", {state:{emitterId: session.userId, receptorId: '3'}});
    const redirectPublications = () => navigate("/publication");
    const redirectPostulations = () => navigate("/postulation");
    const redirectSubscriptions = () => navigate("/subscription");
    const redirectProfile = () => navigate("/profile/" + session.userId + "/" + session.role);
    const closeSession = () => session.logout();

    const handleChangeRole = (event) => {
        const newRole = event.target.value;
        session.switchRole(newRole);
        setRole(newRole);
    }

    const navStyles = {
        background: '#C23EBEE8',
        padding: 10,
        color: 'white',
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    }

    return (
        <nav style={navStyles}>
            {/* <Typography variant="h6"
            >CuidaLaCasa
            </Typography> */}
            <Button className="homepage"
                    onClick={redirectHome}
                    variant="themed"
                    onFocus={() => session.focusHome()}
            >
                <img src={imgLogo} height="40px" width="180px" alt="Logo"/>
            </Button>

            <div style={{display: "flex", justifyContent: "space-between", gap: "1rem"}}>
                <Button className="homepage"
                        onClick={redirectChat}
                        disabled={true}
                        variant="themed"
                        style={{color: session.isFocusChat() ? 'black' : 'white'}}
                        onFocus={() => session.focusChat()}
                >Chat</Button>

                <Button className="homepage"
                        onClick={redirectPublications}
                        variant="themed"
                        style={{color: session.role === "sitter" ? "#bbb" : (session.isFocusPublications() ? 'black' : 'white')}}
                        onFocus={() => session.focusPublications()}
                        disabled={session.role === "sitter"}
                >Publications</Button>

                <Button className="homepage"
                        onClick={redirectPostulations}
                        variant="themed"
                        style={{color: session.isFocusPostulations() ? 'black' : 'white'}}
                        onFocus={() => session.focusPostulations()}
                >Postulations</Button>

                <Button className="homepage"
                        variant="themed"
                        onClick={redirectSubscriptions}
                        style={{color: session.isFocusSubscriptions() ? 'black' : 'white'}}
                        onFocus={() => session.focusSubscriptions()}
                >Subscription</Button>

                <Button className="homepage"
                        variant="themed"
                        onClick={redirectProfile}
                        style={{color: session.isFocusProfile() ? 'black' : 'white'}}
                        onFocus={() => session.focusProfile()}
                >Profile</Button>

                <FormControl sx={{minWidth: 120}} size="small">
                    <InputLabel id="demo-select-small-label">Role</InputLabel>
                    <Select
                        sx={{backgroundColor: '#f67fef'}}
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={role}
                        label="Role"
                        onChange={handleChangeRole}
                    >
                        <MenuItem value={"sitter"}>Sitter</MenuItem>
                        <br/>
                        <MenuItem value={"owner"}>Owner</MenuItem>
                    </Select>
                </FormControl>

                <IconButton component="span"
                            className="homepage"
                            style={{color: session.isFocusLogout() ? 'black' : 'white'}}
                            onFocus={() => session.focusLogout()}
                            onClick={closeSession}>
                    <LogoutIcon/>
                </IconButton>
            </div>
        </nav>
    );
}
