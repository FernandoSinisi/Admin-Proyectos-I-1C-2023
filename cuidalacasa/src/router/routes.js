import {Route, Routes} from "react-router-dom"
import SearchScreen from "../screens/searchScreen"
import PublicationScreen from "../screens/publicationScreen"
import PostulationScreen from "../screens/postulationScreen"
import ProfileScreen from "../screens/profileScreen"
import SubscriptionScreen from "../screens/subscriptionScreen"
import ChatScreen from "../screens/chatScreen";

const LoggedRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<SearchScreen/>}/>
            <Route path="/chat" element={<ChatScreen/>}/>
            <Route path="/publication" element={<PublicationScreen/>}/>
            <Route path="/postulation" element={<PostulationScreen/>}/>
            <Route path="/subscription" element={<SubscriptionScreen/>}/>
            <Route path="/profile/:id/:role" element={<ProfileScreen/>}/>
        </Routes>
    )
}
export default LoggedRouter;

