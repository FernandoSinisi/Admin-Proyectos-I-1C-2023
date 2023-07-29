import {useState} from "react"
import {useLocation} from 'react-router-dom'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import {Box, Button, CardActionArea, Chip, Modal, TextField} from "@mui/material"
import Rating from '@mui/material/Rating'
import StarIcon from "@mui/icons-material/Star"

import {useSession} from "../auth/auth"
import publicationService from "../services/publication/publicationService"
import postulationService from "../services/postulation/postulationService"
import profileService from "../services/profile/profileService"
import ratingService from '../services/rating/ratingService'

import emailjs from 'emailjs-com';
import emailjsConfig from "../emailjs/emailjs"

const ProfileCard = (props) => {
    const [publicationVisible, setPublicationVisible] = useState(false)
    const [applicationVisible, setApplicationVisible] = useState(false)
    const [ratingVisible, setRatingVisible] = useState(false)

    const [postulationComment, setPostulationComment] = useState("")
    const [ratingComment, setRatingComment] = useState("")
    const [ratingStars, setRatingStars] = useState(3)

    const session = useSession()
    const location = useLocation()

    const [ownProfile] = profileService.getProfiles({
        filters: {userId: session.userId}
    })

    const handlePostulationComment = (event) => {
        setPostulationComment(event.target.value)
    }

    const apply = (event) => {
        const newPostulation = {
            userId: session.userId,
            publicationId: props.publicationId,
            ownerId: props.userId,
            state: "Pending",
            comment: postulationComment,
            role: "owner"
        }
        const sitterProfile = profileService.getProfile(props.userId)
        postulationService.storePostulation(newPostulation)

        const mailParams = {
            subject : 'Nueva postulación',
            msg: `Estimado ${sitterProfile.name},\n`+'\n'+
                `${ownProfile.name} se ha postulado a una de tus publicaciones.` + '\n' +
                'Si deseas revisar las postulaciones lo puedes hacer desde la plataforma.\n',
            toEmail: sitterProfile.email
        }

        
        emailjs.send(emailjsConfig.serviceId, emailjsConfig.templateId, mailParams, emailjsConfig.userId)
            .then((result) => {
                console.log("Email sent.")
            }, (error) => {
                console.log(error.text)
        })

        props.refresh()
        setPublicationVisible(false)
        setApplicationVisible(false)
    }

    const cantApply = () => {
        const invalidApplicants = [
            ...props.postulations.map(p => p.userId),
            publicationService.getPublication(props.publicationId).userId
        ]

        return (invalidApplicants.includes(session.userId))
    }

    const checkSubscription = () => {
        let numberPostulations = postulationService.getUserPostulations(session.userId).length
        switch (ownProfile.subscription) {
            case "Basic":
                return false
            case "Standard":
                if (numberPostulations < 6) {
                    return true
                } else {
                    return false
                }
            case "Premium":
                return true
            default:
                return false
        }
    }

    const handleDeletePublication = (event) => {
        props.deletePublication(event)
        setPublicationVisible(false)
    }

    const handleDeletePostulation = (event) => {
        postulationService.deletePostulation(event.target.value)
        props.refresh()
        setPublicationVisible(false)
    }

    const saveRating = () => {
        const ownerProf = profileService.getProfile(props.ownerId)
        const applicantProf = profileService.getProfile(props.applicantId)

        ratingService.storeRating({
            publicationId: props.publicationId,
            rater: session.userId,
            ratee: session.role === "owner" ? ownerProf.userId : applicantProf.userId,
            role: session.role === "sitter" ? "owner" : "sitter",
            comment: ratingComment,
            rating: ratingStars,
            public: false
        })

        setRatingVisible(false)
    }

    const ratingExists = (ratee) => {
        const existingRatings = ratingService.getAllRating()
        return existingRatings.some(r => (
            r.rating.publicationId === props.publicationId &&
            r.rating.rater === session.userId &&
            r.rating.ratee === ratee
        ))
    }

    const imgStylesS = {
        borderRadius: "50%",
        width: "50px",
        height: "auto",
        display: "block",
        border: "2px solid black"
    }

    const getChipColorState = () => {
        switch (props.state) {
            case 'Accepted':
                return 'success';
            case 'Pending':
                return 'warning';
            case 'Declined':
                return 'error';
            default:
                return 'default';
        }
    }

    const imgStylesL = {
        borderRadius: "50%",
        width: "200px",
        height: "auto",
        display: "block",
        marginBottom: "1rem",
        border: "5px solid black"
    }

    const publicationDataElement =
        <div>
            <Typography gutterBottom variant="h7" component="div">
                {props.title}
            </Typography>
            <br/>
            <Typography variant="body2" color="text.secondary">
                📅{props.date}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                📍{props.place}
            </Typography>
            {Array.isArray(props.pets) && props.pets.length > 0 &&
                <Typography variant="body2" color="text.secondary">
                    <br/>
                    <span>Pets I can take care of:</span>
                    <ul style={{listStyleType: "none"}}>
                        {Array.isArray(props.pets) && props.pets.map((pet, index) => (
                            <li style={{display: "inline-block", margin: "5px"}} key={index}>{pet}</li>
                        ))}
                    </ul>
                </Typography>
            }
            <Rating
                value={profileService.getProfile(props.userId).sitterRating}
                readOnly
                precision={0.5}
                icon={<StarIcon style={{ opacity: 1, color: "black"}} fontSize="inherit" />}
                emptyIcon={<StarIcon style={{ opacity: 1 }} fontSize="inherit" />}
            />
        </div>

    const profileCardElement =
        <Card sx={{maxWidth: 345}}>
            <CardActionArea onClick={() => setPublicationVisible(true)}>
                <CardMedia
                    component="img"
                    height="190"
                    src={props.imgs[0]}
                    alt="green iguana"
                />
                <CardContent>
                    {publicationDataElement}
                    {props.postulation &&
                        <Box>
                            <div style={{
                                display: "flex", alignItems: "center", justifyContent: "right", marginTop: 5,
                                marginRight: 8
                            }}>
                                <Chip label={props.state} color={getChipColorState()}/>
                            </div>
                        </Box>
                    }
                </CardContent>
            </CardActionArea>
        </Card>

    const applyModal =
        <Modal open={applicationVisible} onClose={() => setApplicationVisible(false)}>
            <Box style={{
                flexDirection: 'column',
                display: 'flex',
                backgroundColor: '#ffffff',
                borderRadius: 10,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                border: '2px solid #000',
                boxShadow: 100,
                padding: 5
            }}>
                <Typography sx={{marginTop: 5, marginLeft: 3}} variant="h6">
                    Write your application
                </Typography>
                <TextField onChange={handlePostulationComment}
                           value={postulationComment}
                           placeholder="Tell them why you're perfect for their sit."
                           fullWidth
                           multiline
                           rows={5}
                           variant="outlined"
                           autoFocus
                           sx={{margin: 3, width: "80%"}}
                >
                </TextField>
                <Button onClick={() => apply()} style={{width: 300, marginTop: 10}}>
                    Continue
                </Button>
            </Box>
        </Modal>

    const profileModal =
        <Modal open={publicationVisible} onClose={() => setPublicationVisible(false)}>
            <Box style={{
                flexDirection: 'column', display: 'flex', backgroundColor: '#ffffff', borderRadius: 10,
                alignItems: 'center', position: 'absolute', top: '50%', left: '50%', width: '50%', maxHeight: '90%',
                transform: 'translate(-50%, -50%)', border: '2px solid #000', boxShadow: 100, padding: 5
            }}>

                {/* Publication data */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    borderBottom: "1px solid #333",
                    justifyContent: "center",
                    gap: "3rem",
                    width: '100%',
                    height: '100%',
                    margin: 5
                }}>
                    <img style={imgStylesL} src={props.imgs[0]}></img>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {props.postulation &&
                            <Box>
                                <div style={{
                                    display: "flex", alignItems: "center", justifyContent: "right", marginTop: 5,
                                    marginRight: 8
                                }}>
                                    <Chip label={props.state} color={getChipColorState()}/>
                                </div>
                            </Box>
                        }
                        {publicationDataElement}
                    </div>
                </div>

                {/* Descripcion - Botones - Applicants */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    height: '100%',
                    margin: 5
                }}>
                    {props.postulation ?
                        props.comment && <Typography sx={{marginTop: 3}} variant="h7">
                            Comment you left them
                            <p style={{marginTop: '10px', marginLeft: '7px'}}>{props.comment}</p>
                        </Typography>
                        :
                        <>
                            <Typography variant="h5">
                                Description
                            </Typography>
                            <p style={{margin: 2}}>{props.description}</p>
                        </>
                    }

                    {session.role === "owner" && checkSubscription() && location.pathname === "/" &&
                        <Button variant="contained"
                                style={{float: 'right', backgroundColor: '#6E2CA4E8', alignItems: "center"}}
                                onClick={() => setApplicationVisible(true)}
                                disabled={cantApply()}
                        >
                            Apply to sitter
                        </Button>
                    }

                    {session.role === "owner" && location.pathname === "/postulation" &&
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            {props.state === "Pending" &&
                                <Button variant="contained"
                                        style={{
                                            float: 'right',
                                            backgroundColor: '#6E2CA4E8',
                                            alignItems: "center",
                                            marginTop: 10,
                                            marginRight: 5
                                        }}
                                        value={props.postulationId}
                                        onClick={handleDeletePostulation}
                                >
                                    Cancel application
                                </Button>
                            }
                            {props.state === "Accepted" && <Button variant="contained"
                                                                   style={{
                                                                       float: 'right',
                                                                       backgroundColor: '#6E2CA4E8',
                                                                       alignItems: "center",
                                                                       marginTop: 10,
                                                                       marginRight: 5
                                                                   }}
                                                                   value={props.postulationId}
                                                                   onClick={() => setRatingVisible(true)}
                                                                   disabled={ratingExists(props.ownerId)}>
                                Rate sitting
                            </Button>}
                            <Button variant="contained"
                                    style={{
                                        float: 'right', backgroundColor: '#6E2CA4E8',
                                        alignItems: "center", marginTop: 10
                                    }}
                                    value={props.postulationId}
                                    onClick={() => props.openChat(props.ownerId)}>
                                Open chat with sitter
                            </Button>

                        </div>
                    }
                </div>
            </Box>
        </Modal>

    const ratingModal = location.pathname !== "/" &&
        <Modal open={ratingVisible} onClose={() => setRatingVisible(false)}>
            <Box style={{
                flexDirection: 'column',
                display: 'flex',
                backgroundColor: '#ffffff',
                borderRadius: 10,
                alignItems: 'center',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                border: '2px solid #000',
                boxShadow: 100,
                padding: 5
            }}>
                {props.role &&
                    <Typography variant="h6">
                        Rate {
                        session.role === "sitter" ?
                            props.role === "sitter" ?
                                profileService.getProfile(props.ownerId).name : // sitter rateando postulacion de sitter
                                profileService.getProfile(props.applicantId).name // sitter rateando postulacion de owner
                            :
                            props.role === "sitter" ?
                                profileService.getProfile(props.applicantId).name : // owner rateando postulacion de sitter
                                profileService.getProfile(props.ownerId).name // owner rateando postulacion de owner
                    }
                    </Typography>
                }
                <Rating
                    value={ratingStars}
                    onChange={(event, newValue) => {
                        setRatingStars(newValue);
                    }}
                    precision={0.5}
                    icon={<StarIcon style={{opacity: 1, color: "black"}} fontSize="inherit"/>}
                    emptyIcon={<StarIcon style={{opacity: 1}} fontSize="inherit"/>}
                />
                <TextField onChange={(event) => setRatingComment(event.target.value)}
                           value={ratingComment}
                           placeholder="What was your experience like with this sitting?"
                           fullWidth
                           multiline
                           rows={5}
                           variant="outlined"
                           autoFocus
                           sx={{margin: 3, width: "80%"}}
                >
                </TextField>
                <Button onClick={saveRating} style={{width: 300, marginTop: 10}}>
                    Continue
                </Button>
            </Box>
        </Modal>

    return (
        <div style={{alignItems: "center", display: 'flex', justifyContent: "space-between"}}>
            {profileCardElement}
            {profileModal}
            {applyModal}
            {ratingModal}
        </div>
    )
}

export default ProfileCard
