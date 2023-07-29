import React, {useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom"

const SessionContext = React.createContext()

export function useSession() {
    const context = React.useContext(SessionContext);

    if (!context) {
        throw new Error("El contexto debe estar dentro del proveedor.");
    }
    return context;
}

export function SessionProvider(props) {
    const [role, setRole] = useState("sitter")
    const [userId, setUserId] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        setUserId(localStorage.getItem("userId"))
    }, [])

    useEffect(() => {
        focusHome();
        navigate("/");
    }, [role, userId])

    const focusHome = () => {
        localStorage.setItem('focusHome', "true");
        localStorage.setItem('focusChat', "false");
        localStorage.setItem('focusPublications', "false");
        localStorage.setItem('focusPostulations', "false");
        localStorage.setItem('focusProfile', "false");
        localStorage.setItem('focusSubscriptions', "false");
        localStorage.setItem('focusLogout', "false");
    };

    const session = useMemo(() => {
        return ({
            isFocusHome: () => {
                return localStorage.getItem('focusHome') === "true";
            },

            isFocusChat: () => {
                return localStorage.getItem('focusChat') === "true";
            },

            isFocusPublications: () => {
                return localStorage.getItem('focusPublications') === "true";
            },

            isFocusPostulations: () => {
                return localStorage.getItem('focusPostulations') === "true";
            },

            isFocusProfile: () => {
                return localStorage.getItem('focusProfile') === "true";
            },

            isFocusSubscriptions: () => {
                return localStorage.getItem('focusSubscriptions') === "true";
            },

            isFocusLogout: () => {
                return localStorage.getItem('focusLogout') === "true";
            },

            focusHome,

            focusPublications: () => {
                localStorage.setItem('focusHome', "false");
                localStorage.setItem('focusChat', "false");
                localStorage.setItem('focusPublications', "true");
                localStorage.setItem('focusPostulations', "false");
                localStorage.setItem('focusProfile', "false");
                localStorage.setItem('focusLogout', "false");
                localStorage.setItem('focusSubscriptions', "false");
            },

            focusChat: () => {
                localStorage.setItem('focusHome', "false");
                localStorage.setItem('focusChat', "true");
                localStorage.setItem('focusPublications', "false");
                localStorage.setItem('focusPostulations', "false");
                localStorage.setItem('focusProfile', "false");
                localStorage.setItem('focusLogout', "false");
                localStorage.setItem('focusSubscriptions', "false");
            },

            focusPostulations: () => {
                localStorage.setItem('focusHome', "false");
                localStorage.setItem('focusChat', "false");
                localStorage.setItem('focusPublications', "false");
                localStorage.setItem('focusPostulations', "true");
                localStorage.setItem('focusProfile', "false");
                localStorage.setItem('focusLogout', "false");
                localStorage.setItem('focusSubscriptions', "false");
            },

            focusProfile: () => {
                localStorage.setItem('focusHome', "false");
                localStorage.setItem('focusChat', "false");
                localStorage.setItem('focusPublications', "false");
                localStorage.setItem('focusPostulations', "false");
                localStorage.setItem('focusProfile', "true");
                localStorage.setItem('focusLogout', "false");
                localStorage.setItem('focusSubscriptions', "false");
            },

            focusSubscriptions: () => {
                localStorage.setItem('focusHome', "false");
                localStorage.setItem('focusChat', "false");
                localStorage.setItem('focusPublications', "false");
                localStorage.setItem('focusPostulations', "false");
                localStorage.setItem('focusProfile', "false");
                localStorage.setItem('focusLogout', "false");
                localStorage.setItem('focusSubscriptions', "true");
            },

            focusLogout: () => {
                localStorage.setItem('focusHome', "false");
                localStorage.setItem('focusChat', "false");
                localStorage.setItem('focusPublications', "false");
                localStorage.setItem('focusPostulations', "false");
                localStorage.setItem('focusProfile', "false");
                localStorage.setItem('focusLogout', "true");
                localStorage.setItem('focusSubscriptions', "false");
            },

            switchRole: (role) => {
                setRole(role);
            },

            login: (userId) => {
                localStorage.setItem("userId", userId)
                setUserId(userId)
                console.log("Logged in")
            },

            logout: () => {
                localStorage.setItem("userId",  "")

                setUserId(null)
                console.log("Log out")
            },
            role,
            userId
        });
    }, [userId, setUserId, role, setRole]);

    return (
        <SessionContext.Provider value={session}>
            {props.children}
        </SessionContext.Provider>
    )
}

export function WithSession(props) {
    const {userId} = React.useContext(SessionContext)
    if (userId) {
        return props.children
    }
}

export function WithoutSession(props) {
    const {userId} = React.useContext(SessionContext)
    if (!userId) {
        return props.children
    }
}
