import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Box, Button, Chip, Modal, TextField, Typography} from "@mui/material";
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import {DemoContainer} from '@mui/x-date-pickers/internals/demo';
import StarIcon from "@mui/icons-material/Star";
import ChatIcon from '@mui/icons-material/Chat';
import EditIcon from '@mui/icons-material/Edit';
import Rating from '@mui/material/Rating';
import dayjs from 'dayjs';
import Comment from "../components/comment";
import MultipleSelect from "../components/multipleSelect";
import defaultImg from "../img/profiles/defaultProfileImg.png"
import {petTypes} from "../others/constants"
import {useSession} from '../auth/auth';
import profileService from "../services/profile/profileService";
import ratingService from "../services/rating/ratingService";
import postulationService from "../services/postulation/postulationService";
import publicationService from "../services/publication/publicationService";
import veterinaryService from "../services/veterinary/veterinaryService";
import emailjs from "emailjs-com";
import emailjsConfig from "../emailjs/emailjs";


export default function ProfileScreen() {
    const params = useParams()
    const session = useSession()
    const navigate = useNavigate()
    const [openModal, setOpenModal] = useState(false)
    const [file, setFile] = useState(null)
    const [postulationsVisible, setPostulationsVisible] = useState(false);
    const [uploadProfVisible, setUploadProfVisible] = useState(false);
    const [uploadVetVisible, setUploadVetVisible] = useState(false);
    const [ratingVisible, setRatingVisible] = useState(false);
    const [ratingComment, setRatingComment] = useState("");
    const [ratingStars, setRatingStars] = useState(3);
    const [aux, setAux] = useState(true)
    const [ownProf] = profileService.getProfiles({filters: {userId: params.id}})
    const allPostulations = postulationService.getAllPostulation();
    const [postulations, setPostulations] = useState(allPostulations);
    const [formData, setFormData] = useState(ownProf)

    const defaultPubData = {
        "title": "",
        "place": "",
        "dateFrom": dayjs(Date.now()),
        "dateTo": dayjs(Date.now()),
    }

    const defaultVetData = {
        "name": "",
        "place": "",
        "number": "",
        "email": "",
    }
    const [vetData, setVetData] = useState(defaultVetData)
    const [pubData, setPubData] = useState(defaultPubData)

    const handlePubData = (event) => {
        const {name, value} = event.target
        setPubData(prev => ({...prev, [name]: value}))
    }
    const handleVetData = (event) => {
        const {name, value} = event.target
        setVetData(prev => ({...prev, [name]: value}))
    }

    let ratings = ratingService.getAllRating();
    ratings = ratings.filter(r => {
        return (
            r.rating.public &&
            r.rating.ratee === params.id &&
            r.rating.role === session.role
        )
    })

    const redirectSubscription = () => navigate("/subscription");

    const setPet = p => {
        setFormData(prev => {
            return {...prev, pets: p}
        })
    }

    const handleChange = event => {
        const {name, value} = event.target
        if (name === "age" || name === "amount") {
            setFormData(prev => {
                return {
                    ...prev,
                    [name]: parseInt(value.replace(/[^0-9]/g, ''))
                }
            })
        } else {
            setFormData(prev => {
                return {
                    ...prev,
                    [name]: value
                }
            })
        }
    }

    const saveChanges = event => {
        setOpenModal(false)
        event.preventDefault()

        profileService.editProfile({
            userId: params.id,
            ...formData,
            ...(file && {picture: URL.createObjectURL(file)})
        })

        navigate(`/profile/${params.id}/${params.role}`)
    }

    const getChipColorSubscription = () => {
        switch (ownProf.subscription) {
            case 'Basic':
                return 'default';
            case 'Standard':
                return 'primary';
            case 'Premium':
                return 'secondary';
            default:
                return 'default';
        }
    };

    const handleViewPostulations = () => setPostulationsVisible(true);
    const handleClosePostulations = () => setPostulationsVisible(false);

    const handleRatingOpen = () => setRatingVisible(true);
    const handleRatingClose = () => setRatingVisible(false);

    const handleRatingComment = (event) => {
        setRatingComment(event.target.value);
    }

    const uploadProfile = () => {
        const newPublication = {
            userId: session.userId,
            imgs: [ownProf.picture],
            pets: ownProf.pets,
            postulationIds: new Set(),
            open: true,
            role: "sitter",
            ...pubData
        }
        publicationService.storePublication(newPublication)
        setUploadProfVisible(false)
        setAux(prev => !prev)
    };

    const uploadVeterinary = () => {
        const newVeterinary = {
            userId: session.userId,
            imgs: [ownProf.picture],
            pets: ownProf.pets,
            postulationIds: new Set(),
            open: true,
            role: "sitter",
            ...pubData
        }
        veterinaryService.storeVeterinary(newVeterinary)
        setUploadVetVisible(false)
        setAux(prev => !prev)
    };

    const hideProfile = () => {
        const p = publicationService.getAllPublication().filter(p =>
            p.publication.userId === session.userId &&
            p.publication.role === "sitter"
        )[0]

        p.publication.postulationIds.forEach(postulationId => {
            postulationService.deletePostulation(postulationId)
        })

        publicationService.deletePublication(p.hashId)
        setAux(prev => !prev)
        setPubData(defaultPubData)
    }

    const ratingExists = (ownerId) => {
        const existingRatings = ratingService.getAllRating()
        const ownPub = publicationService.getAllPublication().filter(p => p.publication.userId === session.userId && p.publication.role === "sitter")
        return ownPub[0] ? existingRatings.some(r => (
            r.rating.publicationId === ownPub[0].hashId &&
            r.rating.rater === session.userId &&
            r.rating.ratee === ownerId
        )) : false
    }

    const saveRating = () => {
        ratingService.storeRating({
            publicationId: postulations[0].postulation.publicationId,
            rater: session.userId,
            ratee: postulations[0].postulation.userId,
            role: session.role === "sitter" ? "owner" : "sitter",
            comment: ratingComment,
            rating: ratingStars,
            public: false
        })
        setRatingVisible(false)
    }

    const refreshPostulations = () => {
        let postulations = postulationService.getAllPostulation();
        postulations = postulations.filter(p =>
            p.postulation.ownerId === session.userId &&
            p.postulation.role === "owner"
        )
        setPostulations(postulations)
    }

    useEffect(() => {
        refreshPostulations();
    }, []);

    useEffect(() => {
        refreshPostulations()
    }, [ratingVisible])


    const handlerAcceptPostulation = (postulationData, applicantProfile) => {
        // Aceptar postulacion de owner a sitter
        postulationService.editPostulation(postulationData.hashId, {state: "Accepted"});
        // Cerrar publicacion a nuevas postulaciones
        publicationService.editPublication(postulationData.postulation.publicationId, {open: false});

        // Rechazar todas las otras postulaciones
        const postulationIds = publicationService.getPublication(postulationData.postulation.publicationId).postulationIds;
        for (const pId of Array.from(postulationIds)) {
            if (pId !== postulationData.hashId) {
                postulationService.editPostulation(pId, {state: "Declined"});
            }
        }

        // Enviar mail de aceptacion al owner que se postuló
        const contact = ownProf.contact.length > 0 ? ownProf.contact : "54+91165689999"
        const defaultMsg = `Estimado ${applicantProfile.name},\n` + '\n' +
                            `${ownProf.name} ha aceptado su postulación.` + '\n' +
                            `Se puede contactar con ${ownProf.name} al ${contact}.\n`
        const extraIfVet = defaultVetData.name !== null ? `\n` +
                    `Además, el dueño ha decidido proporcionarle datos de su veterinario de confianza:\n` +
                    `Nombre: ${defaultVetData.name}` + '\n' +
                    `Dirección: ${defaultVetData.place}` + '\n' +
                    `Número de teléfono: ${defaultVetData.number}` + '\n' +
                    `Email: ${defaultVetData.email}` + '\n' : ''
        const mailParams = {
            subject: 'Postulación aceptada',
            msg: defaultMsg + extraIfVet,
            toEmail: applicantProfile.email
        }

        
        emailjs.send(emailjsConfig.serviceId, emailjsConfig.templateId, mailParams, emailjsConfig.userId)
            .then((result) => {
                console.log("Email sent.")
            }, (error) => {
                console.log(error.text)
        })

        // Actualizar publicaciones
        refreshPostulations();
    }

    const handlerDeclinePostulation = (postId) => {
        postulationService.editPostulation(postId, {state: "Declined"});
        refreshPostulations();
    }

    const handlerOpenChat = (applicantId) => {
        session.focusChat();
        navigate("/chat", {
            state: {
                emitterId: session.userId,
                receptorId: applicantId
            }
        });
    }

    const imgStyles = {
        borderRadius: "50%",
        width: "200px",
        height: "auto",
        display: "block",
        marginBottom: "1rem",
        border: "5px solid black"
    }

    const imgApplicantStyles = {
        borderRadius: "50%",
        width: "80px",
        height: "auto",
        display: "block",
        marginBottom: "1rem",
        border: "5px solid black"
    }

    const divStyles = {
        backgroundColor: "white",
        margin: "3rem auto",
        padding: "2rem",
        display: "grid",
        minWidth: "500px",
        maxWidth: "50vw",
        gridTemplateColumns: "1fr 7fr 7fr 1fr",
        borderRadius: "1rem"
    }

    const publishStyles = {
        backgroundColor: "white",
        margin: "3rem auto",
        padding: "2rem",
        display: "grid",
        minWidth: "300px",
        maxWidth: "30vw",
        borderRadius: "1rem",
        flexDirection: "column",
        gap: "1rem"
    }

    const editButton = ownProf.userId === session.userId &&
        <EditIcon
            onClick={() => setOpenModal(true)} cursor="pointer"
            style={{
                width: "2rem",
                height: "auto",
                border: "1px solid black",
                borderRadius: "0.5rem",
                padding: "0.2rem"
            }}
        />

    const subscriptionButton = ownProf.userId === session.userId &&
        <Chip color={getChipColorSubscription()} label={ownProf.subscription} component="a" clickable
              onClick={redirectSubscription}
        />

    const profileElement = <div style={divStyles}>
        {editButton}
        <div style={{
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRight: "1px solid black"
        }}>
            <img style={imgStyles} src={ownProf.picture ? ownProf.picture : defaultImg}></img>
            <h1 style={{textAlign: "center"}}>{ownProf.name} {ownProf.lastName}</h1>
            <h3 style={{
                color: "gray",
                fontWeight: 300
            }}>{params.role === "sitter" ? "House sitter" : "House owner"}</h3>
        </div>
        <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", marginLeft: "2.5rem"}}>
            {subscriptionButton}
            <p>🌎 {ownProf.country}</p>
            {
                params.role === "sitter" && Array.isArray(ownProf.pets) && ownProf.pets.length > 0 &&
                <p>I've taken care of:{ownProf.pets.map(p => <li style={{listStyleType: "none"}} key={p}>{p}</li>)}</p>
            }
            <p>{ownProf.age} years old</p>
            {
                params.role === "sitter" &&
                <p>🧑🏻‍🤝‍🧑🏻 {ownProf.amount}</p>
            }
            <Rating
                value={ratings.length === 0 ? 0 : ratings.reduce((prev, curr) => prev + curr.rating.rating, 0) / ratings.length}
                readOnly
                precision={0.5}
                icon={<StarIcon style={{opacity: 1, color: "black"}} fontSize="inherit"/>}
                emptyIcon={<StarIcon style={{opacity: 1}} fontSize="inherit"/>}
            />
            <p>About Me: <br/>{params.role === "sitter" ? ownProf.sitterDescription : ownProf.ownerDescription}</p>
        </div>
    </div>

    const commentsElement = <div style={{
        ...divStyles,
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
    }}>
        <h1 style={{textAlign: "center"}}>Comments</h1>
        <ul style={{listStyleType: "none"}}>
            {
                ratings.map(r => (
                    <Comment key={r.hashId} rating={r.rating}/>
                ))
            }
        </ul>
    </div>

    const publishElement = ownProf.userId === session.userId &&
        <div style={publishStyles}>
            {
                publicationService.getAllPublication().filter(p =>
                    p.publication.role === "sitter" && p.publication.userId === session.userId
                ).length == 0 ?
                    <Button onClick={() => setUploadProfVisible(true)} variant="contained"
                            style={{backgroundColor: '#6E2CA4E8', gridColumn: "1 "}}>
                        Upload Profile
                    </Button>
                    :
                    <Button onClick={hideProfile} variant="contained"
                            style={{backgroundColor: '#6E2CA4E8', gridColumn: "1 "}}>
                        Hide Profile
                    </Button>
            }
            <Button onClick={handleViewPostulations} variant="contained"
                    style={{backgroundColor: '#6E2CA4E8', gridColumn: "1 "}}>
                View Applicants
            </Button>
        </div>

    const publishVeterinary = ownProf.userId === session.userId &&
        <div style={publishStyles}>
            <Button onClick={() => setUploadVetVisible(true)} variant="contained"
                    style={{backgroundColor: '#6E2CA4E8', gridColumn: "1 "}}>
                Load Veterinary Data
            </Button>
        </div>

    const getApplicantElement = (postulation, applicantProfile) => {
        return postulation.postulation.state !== "Declined" &&
            <li style={{listStyleType: "none", marginBottom: "1rem"}}>
                <div style={{display: "flex", gap: "1rem", alignItems: "center", justifyContent: "space-between"}}>
                    <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem"}}>
                        <img style={imgApplicantStyles} src={applicantProfile.picture}></img>
                        <div>
                            <h3><Link
                                style={{textDecoration: "none", color: "#C23EBEE8"}}
                                to={`/profile/${applicantProfile.userId}/owner`}
                            >
                                {applicantProfile.name} {applicantProfile.lastName} ({applicantProfile.ownerRating}★)
                            </Link></h3>
                            {postulation.postulation.comment && <p>{postulation.postulation.comment}</p>}
                        </div>
                    </div>
                    <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: "2rem"}}>
                        <ChatIcon
                            onClick={() => handlerOpenChat(postulation.postulation.userId)}
                            cursor="pointer"
                            style={{
                                width: "2rem",
                                height: "auto",
                                border: "1px solid black",
                                borderRadius: "0.5rem",
                                padding: "0.2rem"
                            }}
                        />
                        {
                            postulation.postulation.state === "Pending" && <div style={{display: "flex", gap: "2rem"}}>
                                <Button variant="contained"
                                        style={{float: 'right', backgroundColor: 'green', alignItems: "center"}}
                                        value={postulation.hashId}
                                        onClick={() => handlerAcceptPostulation(postulation, applicantProfile)}>
                                    Accept
                                </Button>
                                <Button variant="contained"
                                        style={{float: 'right', backgroundColor: 'red', alignItems: "center"}}
                                        value={postulation.hashId}
                                        onClick={() => handlerDeclinePostulation(postulation.hashId)}>
                                    Decline
                                </Button>
                            </div>
                        }
                        {
                            postulation.postulation.state === "Accepted" && <div style={{display: "flex", gap: "2rem"}}>
                                <Button variant="contained"
                                        style={{
                                            float: 'right',
                                            backgroundColor: '#6E2CA4E8',
                                            alignItems: "center",
                                            marginTop: 10
                                        }}
                                        value={postulation.hashId}
                                        onClick={handleRatingOpen}
                                        disabled={ratingExists(postulation.postulation.userId)}
                                >
                                    Rate sitting
                                </Button>
                            </div>
                        }
                    </div>
                </div>
            </li>
    }

    const ratingModal = postulations && postulations.length > 0 &&
        <Modal open={ratingVisible} onClose={() => setRatingVisible(false)}>
            <Box style={{
                flexDirection: 'column',
                display: 'flex',
                alignItems: 'center',
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
                {postulations[0].postulation.role &&
                    <Typography variant="h6">
                        Rate {profileService.getProfile(postulations[0].postulation.userId).name}
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

    const uploadProfModal =
        <Modal open={uploadProfVisible} onClose={() => setUploadProfVisible(false)}>
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
                <TextField onChange={handlePubData}
                           value={pubData.title}
                           label="Title"
                           name="title"
                           autoFocus
                           sx={{width: "80%", margin: "1%"}}
                >
                </TextField>

                <TextField onChange={handlePubData}
                           value={pubData.place}
                           label="Place"
                           name="place"
                           autoFocus
                           sx={{width: "80%", margin: "1%"}}
                >
                </TextField>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker', 'DatePicker']} sx={{margin: 2}}>
                        <DatePicker
                            sx={{marginLeft: 5, marginRight: 2}}
                            label="Date From"
                            name="dateFrom"
                            value={dayjs(pubData.dateFrom)}
                            onChange={newValue => handlePubData({target: {name: "dateFrom", value: newValue}})}
                        />
                        <DatePicker
                            sx={{marginLeft: 2, marginRight: 5}}
                            label="Date To"
                            name="dateTo"
                            value={dayjs(pubData.dateTo)}
                            onChange={newValue => handlePubData({target: {name: "dateTo", value: newValue}})}
                        />
                    </DemoContainer>
                </LocalizationProvider>

                <Button
                    variant="contained"
                    onClick={uploadProfile}
                    style={{width: "90", margin: 10}}
                    // disabled={newPublicationMissingFields()}
                >
                    Upload
                </Button>
            </Box>
        </Modal>

    const uploadVetModal =
        <Modal open={uploadVetVisible} onClose={() => setUploadVetVisible(false)}>
            <Box style={{
                flexDirection: 'column',
                display: 'flex',
                backgroundColor: '#ffffff',
                borderRadius: 10,
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '500px',
                transform: 'translate(-50%, -50%)',
                border: '2px solid #000',
                boxShadow: 100,
                padding: 5
            }}>
                <TextField onChange={handleVetData}
                        value={vetData.name}
                        label="Name"
                        name="name"
                        autoFocus
                        sx={{width: "80%", margin: "1%"}}
                >
                </TextField>

                <TextField onChange={handleVetData}
                        value={vetData.place}
                        label="Place"
                        name="place"
                        autoFocus
                        sx={{width: "80%", margin: "1%"}}
                >
                </TextField>

                <TextField onChange={handleVetData}
                        value={vetData.number}
                        label="Number"
                        name="number"
                        autoFocus
                        sx={{width: "80%", margin: "1%"}}
                >
                </TextField>

                <TextField onChange={handleVetData}
                        value={vetData.email}
                        label="Email"
                        name="email"
                        autoFocus
                        sx={{width: "80%", margin: "1%"}}
                >
                </TextField>

                <Button
                    variant="contained"
                    onClick={uploadVeterinary}
                    style={{width: "90", margin: 10}}
                >
                    Upload
                </Button>
            </Box>
        </Modal>

    return (
        <div>
            {(session.role === "sitter") ?
                <div style={{display: "grid", gridTemplateColumns: "1fr auto"}}>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        paddingLeft: "22rem"
                    }}>
                        {profileElement}
                        {commentsElement}
                    </div>
                    <div style={{justifySelf: "end", paddingRight: "3rem"}}>{publishElement}</div>
                </div> :
                <div style={{display: "grid", gridTemplateColumns: "1fr auto"}}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    paddingLeft: "22rem"
                }}>
                    {profileElement}
                    {commentsElement}
                </div>
                <div style={{justifySelf: "end", paddingRight: "3rem"}}>{publishVeterinary}</div>
            </div>
            }
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Box style={{
                    display: 'grid',
                    gridTemplateColumns: "50% 50%",
                    gridAutoRows: "minmax(50px, auto)",
                    gap: "1rem",
                    backgroundColor: '#ffffff',
                    borderRadius: 10,
                    alignItems: 'center',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    // border: '2px solid #000',
                    boxShadow: 100,
                    padding: "1rem",
                }}>
                    <Button variant="contained" component="label" style={{gridColumn: "1 / 3"}}>
                        Upload Picture
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                                setFile(event.target.files[0])
                            }}
                        />
                    </Button>

                    <TextField onChange={handleChange}
                               value={formData.name}
                               name="name"
                               label="Name"
                               autoFocus
                               style={{gridColumn: "1 / 2"}}
                    />
                    <TextField onChange={handleChange}
                               value={formData.lastName}
                               name="lastName"
                               label="Last Name"
                               autoFocus
                               style={{gridColumn: "2 / 3"}}
                    />
                    <TextField onChange={handleChange}
                               value={formData.country}
                               name="country"
                               label="Country"
                               autoFocus
                               style={{gridColumn: "1 / 3"}}
                    />
                    <TextField onChange={handleChange}
                               value={params.role === "sitter" ? formData.sitterDescription : formData.ownerDescription}
                               name={params.role === "sitter" ? "sitterDescription" : "ownerDescription"}
                               label="About Me"
                               autoFocus
                               style={{gridColumn: "1 / 3"}}
                    />
                    <TextField onChange={handleChange}
                               value={formData.age}
                               name="age"
                               label="Age"
                               autoFocus
                               InputProps={{
                                   inputProps: {
                                       pattern: '[0-9]*', // Allow only numbers
                                   },
                               }}
                               style={{gridColumn: "1 / 2"}}
                    />
                    <TextField onChange={handleChange}
                               value={formData.amount}
                               name="amount"
                               label="# of Sitters"
                               autoFocus
                               InputProps={{
                                   inputProps: {
                                       pattern: '[0-9]*', // Allow only numbers
                                   },
                               }}
                               style={{gridColumn: "2 / 3"}}
                    />

                    <MultipleSelect
                        data={[formData.pets, setPet]}
                        options={petTypes}
                        label="Pets"
                        multiple={true}
                        style={{gridColumn: "1 / 3", placeContent: "center"}}
                    />

                    <Button onClick={saveChanges} style={{gridColumn: "1 / 3"}}>
                        Save Changes
                    </Button>
                </Box>
            </Modal>

            <Modal open={postulationsVisible} onClose={() => setPostulationsVisible(false)}>
                <Box style={{
                    flexDirection: 'column', display: 'flex', backgroundColor: '#ffffff', borderRadius: 10,
                    alignItems: 'center', position: 'absolute', top: '50%', left: '50%', width: '50%', maxHeight: '90%',
                    transform: 'translate(-50%, -50%)', border: '2px solid #000', boxShadow: 100, padding: 5
                }}>
                    <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        justifyContent: 'space-between', width: '100%', height: '100%', margin: 5
                    }}>
                        {/* Applicants */}
                        {session.role === "sitter" &&
                            <div style={{
                                display: 'flex', flexDirection: 'column', width: '100%', height: '100%', margin: 5,
                            }}>
                                <Typography variant="h5" textAlign="center">
                                    Applicants
                                </Typography>
                                <ul>
                                {
                                    postulations.sort((p, q) => {
                                        const applicantProfP = profileService.getProfile(p.postulation.userId)
                                        const applicantProfQ = profileService.getProfile(q.postulation.userId)
                                        return -(applicantProfP.ownerRating - applicantProfQ.ownerRating)
                                    }).map(p => {
                                        const applicantProf = profileService.getProfile(p.postulation.userId)
                                        return getApplicantElement({...p}, applicantProf)
                                    })
                                }
                                </ul>
                            </div>
                        }
                    </div>
                </Box>
            </Modal>
            {ratingModal}
            {uploadProfModal}
            {uploadVetModal}
        </div>
    )
}
