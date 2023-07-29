import {useState, useEffect} from "react"
import { useNavigate } from "react-router"
import {Box, Modal, Button, Grid, TextField} from "@mui/material"
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers'
import {DemoContainer} from '@mui/x-date-pickers/internals/demo'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import dayjs from 'dayjs'
import {useSession} from "../auth/auth"
import publicationService from "../services/publication/publicationService"
import postulationService from "../services/postulation/postulationService"
import profileService from "../services/profile/profileService"
import HouseCard from "../components/houseCard"
import MultipleSelect from "../components/multipleSelect"
import {houseTypes, petTypes} from "../others/constants"
import {formatDate} from "../others/utils"
import emailjs from "emailjs-com";
import emailjsConfig from "../emailjs/emailjs";

const PublicationScreen = () => {
    const defaultHouseSearchData = {
        "userId": "",
        "place": "",
        "type": "",
        "pets": "",
        "dateFrom": "",
        "dateTo": "",
        "duration": 0
    }

    const defaultPubData = {
        "title": "",
        "place": "",
        "type": "",
        "pets": [],
        "imgs": [],
        "description": "",
        "dateFrom": dayjs(Date.now()),
        "dateTo": dayjs(Date.now()),
        "open": true,
        "role": "owner"
    }

    const [newPublicationVisible, setNewPublicationVisible] = useState(false)

    const [houseSearchData, setHouseSearchData] = useState(defaultHouseSearchData)
    const [pubData, setPubData] = useState(defaultPubData)
    const [pubImgs, setPubImgs] = useState([])

    const [publications, setPublications] = useState([])
    const [filteredPublications, setFilteredPublications] = useState([])
    const [numberPublications, setNumberPublications] = useState(0);

    const navigate = useNavigate()
    const session = useSession()

    const [prof] = profileService.getProfiles({
        filters: {userId: session.userId}
    })

    const refreshPublications = () => {
        let publications = publicationService.getAllPublication()
        publications = publications.filter(p => (
            p.publication.role === "owner" &&
            p.publication.userId === session.userId
        ))
        setPublications(publications)
        setFilteredPublications(publications)
        setNumberPublications(publicationService.getUserPublications(session.userId).length)
        setHouseSearchData(defaultHouseSearchData)
        setPubData(defaultPubData)
    }

    // Component did mount
    useEffect(() => {
        refreshPublications()
    }, [])

    useEffect(() => {
        // console.log(`Refreshing - Found ${filteredPublications.length} publications`)
    }, [filteredPublications, setFilteredPublications])

    const handleHouseSearch = (event) => {
        const {name, value} = event.target
        setHouseSearchData(prev => ({...prev, [name]: value}))
        let result = publications

        if (name === "duration" && value > 0) { // se acaba de actualizar este filtro -> usar filtro nuevo
            result = result.filter(p => parseInt(value) === p.publication.dateTo.diff(p.publication.dateFrom, 'day') + 1)
        } else if (houseSearchData.duration && houseSearchData.duration > 0 && value > 0) { // usar filtro viejo si existia
            result = result.filter(p => parseInt(houseSearchData.duration) === p.publication.dateTo.diff(p.publication.dateFrom, 'day') + 1)
        }

        if (name === "pets" && value !== "Any") {
            result = result.filter(p => p.publication.pets.includes(value))
        } else if (houseSearchData.pets && houseSearchData.pets !== "Any" && value !== "Any") {
            result = result.filter(p => p.publication.pets.includes(houseSearchData.pets))
        }

        if (name === "place") {
            result = result.filter(p => p.publication.place.toLowerCase().includes(value.toLowerCase()))
        } else if (houseSearchData.place) {
            result = result.filter(p => p.publication.place.toLowerCase().includes(houseSearchData.place.toLowerCase()))
        }

        if (name === "type" && value !== "Any") {
            result = result.filter(p => p.publication.type.toLowerCase().includes(value.toLowerCase()))
        } else if (houseSearchData.type && houseSearchData.type !== "Any" && value !== "Any") {
            result = result.filter(p => p.publication.type.toLowerCase().includes(houseSearchData.type.toLowerCase()))
        }

        result = result.filter(p => p.publication.userId === session.userId)

        setFilteredPublications(result)
    }

    // funcion auxiliar para tener un multiple select como elemento controlado
    // devuelve una funcion que recibe un value y usa una funcion f (que viene de un useState) para
    // actualizar la propiedad name al nuevo valor value en el json de ese state
    const setMultipleSelect = (f, name) => {
        return (value) => f(prev => ({...prev, [name]: value}))
    }

    const handlePubData = (event) => {
        const {name, value} = event.target
        setPubData(prev => ({...prev, [name]: value}))
    }

    const newPublicationMissingFields = () => {
        if (pubImgs.length <= 0) {
            return true
        }
        for (const v of Object.values(pubData)) {
            if (!v) {
                return true
            }
        }
        return false
    }

    const checkSubscription = () => {
        switch (prof.subscription) {
            case "Basic":
                return false
            case "Standard":
                return numberPublications < 6;
            case "Premium":
                return true
            default:
                return false
        }
    }

    const handleAddPublication = (event) => {
        const newPublication = {
            ...pubData, 
            userId: session.userId,
            imgs: pubImgs.map(img => URL.createObjectURL(img)),
            postulationIds: new Set(),
            open: true,
            role: "owner"
        }
        publicationService.storePublication(newPublication)
        refreshPublications()
        setNewPublicationVisible(false)
    }

    const handleDeletePublication = (event) => {
        publicationService.deletePublication(event.target.value)
        refreshPublications()
    }

    const handleAcceptApplication = (postulation, applicantProfile) => {
        // Aceptar postulacion a vivienda
        postulationService.editPostulation(postulation.id, {state: "Accepted"})
        // Cerrar publicacion a nuevas postulaciones
        publicationService.editPublication(postulation.publicationId, {open: false})
        // Rechazar todas las otras postulaciones
        const postulationIds = publicationService.getPublication(postulation.publicationId).postulationIds
        for (const pId of Array.from(postulationIds)) {
            if (pId !== postulation.id) {
                postulationService.editPostulation(pId, {state: "Declined"})
            }
        }

        // Enviar mail de aceptacion al sitter que se postuló a la vivienda
        const contact = prof.contact.length > 0 ? prof.contact : "54+91165689999";
        const mailParams = {
            subject: 'Postulación aceptada',
            msg: `Estimado ${applicantProfile.name},\n` + '\n' +
                `${prof.name} ha aceptado su postulación.` + '\n' +
                `Se puede contactar con ${prof.name} al ${contact}.\n`,
            toEmail: applicantProfile.email
        }

        
        emailjs.send(emailjsConfig.serviceId, emailjsConfig.templateId, mailParams, emailjsConfig.userId)
            .then((result) => {
                console.log("Email sent.")
            }, (error) => {
                console.log(error.text)
        })

        // Actualizar publicaciones
        refreshPublications()
    }

    const handleDeclineApplication = (postId) => {
        postulationService.editPostulation(postId, {state: "Declined"})
        refreshPublications()
    }

    const handleOpenChat = (applicantId) => {
        session.focusChat()
        navigate("/chat", {
            state: {
                emitterId: session.userId,
                receptorId: applicantId
            }
        })
    }

    const houseSearchBar =
        <div style={{padding: 10, alignItems: "center", display: "flex", justifyContent: "space-between"}}>
            <TextField onChange={handleHouseSearch}
                style={{borderRadius: 10, backgroundColor: "white", width: "20%", marginTop: 5}}
                margin="normal"
                name="place"
                value={houseSearchData.place}
                label="🔍 Place"
                autoFocus
            >
            </TextField>

            <TextField onChange={handleHouseSearch}
                style={{borderRadius: 10, backgroundColor: "white", width: "15%", marginTop: 5}}
                margin="normal"
                name="duration"
                label={houseSearchData.duration === 0 ? "Duration" : ""}
                autoFocus inputProps={{
                    type: "number",
                    min: 0,
                    "aria-label": "Duration",
                }}
                InputLabelProps={{
                    shrink: houseSearchData.duration !== 0 && houseSearchData.duration !== '',
                }}
            >
            </TextField>

            <MultipleSelect handleChange={handleHouseSearch}
                style={{width: "15%"}}
                name="pets"
                data={[houseSearchData.pets, setMultipleSelect(setHouseSearchData, "pet")]}
                options={[...petTypes, "Any"]}
                label="Pets"
                multiple={false}
            />

            <MultipleSelect handleChange={handleHouseSearch}
                style={{width: "15%"}}
                name="type"
                data={[houseSearchData.type, setMultipleSelect(setHouseSearchData, "type")]}
                options={[...houseTypes, "Any"]}
                label="Type"
                multiple={false}
            />

            {
                session.role === "owner" && checkSubscription() &&
                <Button variant="contained"
                        style={{backgroundColor: '#6E2CA4E8', width: "20%"}}
                        onClick={() => setNewPublicationVisible(true)}>
                    Publicar vivienda
                </Button>
            }
            
        </div>

    const housesElement =
        <div style={{padding: 10}}>
            <Grid container spacing={3} direction="row" justify="flex-start" alignItems="flex-start">
                {filteredPublications.map(elem => {
                    const postulations = [...elem.publication.postulationIds]
                        .map(pId => ({...postulationService.getPostulation(pId), id: pId}))
                        .filter(p => p.state && p.state !== "Declined")
                    
                    return <Grid item xs={12} sm={6} md={3} key={filteredPublications.indexOf(elem)}>
                        <HouseCard
                            publicationId={elem.hashId}
                            userId={elem.publication.userId}
                            title={elem.publication.title}
                            description={elem.publication.description}
                            place={elem.publication.place}
                            type={elem.publication.type}
                            pets={elem.publication.pets}
                            date={formatDate(elem.publication.dateFrom, elem.publication.dateTo)}
                            imgs={elem.publication.imgs}
                            postulations={postulations}

                            // para rating modal, solo se va a usar cuando hay 1 sola postulacion y es la primera
                            applicantId={postulations[0] && postulations[0].userId ? postulations[0].userId : ""}
                            ownerId={postulations[0] && postulations[0].ownerId ? postulations[0].ownerId : ""}
                            role={postulations[0] && postulations[0].role ? postulations[0].role : ""}
                            postulation={false}

                            deletePublication={handleDeletePublication}
                            acceptApplication={handleAcceptApplication}
                            declineApplication={handleDeclineApplication}
                            openChat={handleOpenChat}
                            refresh={refreshPublications}
                        >
                        </HouseCard>
                    </Grid>
                })}
            </Grid>
        </div>
    
    const newPubModal =
        <Modal open={newPublicationVisible} onClose={() => setNewPublicationVisible(false)}>
            <Box style={{
                flexDirection: 'column', display: 'flex', backgroundColor: 'white',
                borderRadius: 10, alignItems: 'center', position: 'absolute',
                top: '50%', left: '50%', transform: 'translate(-50%, -50%)', border: '2px solid #000',
                boxShadow: 100,
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

                <MultipleSelect
                    data={["", setMultipleSelect(setPubData, "type")]}
                    options={houseTypes}
                    label="Type"
                    multiple={false}
                    style={{width: "80%", margin: "1%"}}
                />

                <MultipleSelect
                    data={[pubData.pets, setMultipleSelect(setPubData, "pets")]}
                    options={petTypes}
                    label="Pets"
                    multiple={true}
                    style={{width: "80%", margin: "1%"}}
                />

                <TextField onChange={handlePubData}
                        value={pubData.description}
                        label="Description"
                        name="description"
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

                <Button variant="contained" style={{width: "90%"}}>
                    <PhotoCamera/>
                    <input
                        type="file"
                        accept="image/*"
                        name="image"
                        multiple
                        onChange={event => {
                            setPubImgs([...event.target.files])
                        }}
                    />
                </Button>

                <Button
                    variant="contained"
                    onClick={handleAddPublication}
                    style={{width: "90", margin: 10}}
                    disabled={newPublicationMissingFields()}>
                    Publicar
                </Button>
            </Box>
        </Modal>

    return (
        <div>
            {houseSearchBar}
            {newPubModal}
            {housesElement}
        </div>
    )
}

export default PublicationScreen
