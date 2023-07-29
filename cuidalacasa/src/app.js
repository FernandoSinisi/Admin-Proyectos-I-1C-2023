import {SessionProvider, WithoutSession, WithSession} from './auth/auth';
import LoggedRouter from "./router/routes";
import LoginScreen from "./screens/loginScreen";
import NavBar from "./components/navBar";

import backgroundImage from './img/collage.png'

export default function App() {
    return (
        <SessionProvider>
            <WithSession>
                <div style={{
                    backgroundColor: '#E1F5FE',
                    overflow: "auto",
                    minHeight: "100vh",
                    // backgroundImage: `url(${backgroundImage})`
                }}>
                    <NavBar />
                    <LoggedRouter />
                </div>
            </WithSession>
            <WithoutSession>
                <LoginScreen/>
            </WithoutSession>
        </SessionProvider>
    );
}
