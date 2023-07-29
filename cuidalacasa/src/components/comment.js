import profileService from "../services/profile/profileService"
import StarIcon from "@mui/icons-material/Star";
import Rating from '@mui/material/Rating';


export default function Comment(props) {
    const raterProf = profileService.getProfile(props.rating.rater)

    const imgStyles = {
        borderRadius: "50%",
        width: "50px",
        height: "50px",
        display: "block",
        border: "2px solid black"
    }

    return (
        <li style={{display: "flex", gap: "1rem", paddingBottom: "2rem"}}>
            <img src={raterProf.picture} style={imgStyles}></img>
            <div>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <h3>{raterProf.name} {raterProf.lastName}</h3>
                    <Rating
                        value={props.rating.rating}
                        readOnly
                        precision={0.5}
                        icon={<StarIcon style={{ opacity: 1, color: "black"}} fontSize="inherit" />}
                        emptyIcon={<StarIcon style={{ opacity: 1 }} fontSize="inherit" />}
                    />
                </div>
                <p style={{overflowWrap: "break-word"}}>
                    {props.rating.comment}
                </p>
            </div>
        </li>
    )
}
