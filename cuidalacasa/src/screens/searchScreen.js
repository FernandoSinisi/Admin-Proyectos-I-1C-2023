import {useState, useEffect} from "react"

import {Grid, TextField} from "@mui/material"
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

import {useSession} from "../auth/auth"
import publicationService from "../services/publication/publicationService"
import postulationService from "../services/postulation/postulationService"

import HouseCard from "../components/houseCard"
import MultipleSelect from "../components/multipleSelect"

import {houseTypes, petTypes} from "../others/constants"
import {formatDate} from "../others/utils"
import ProfileCard from "../components/profileCard"
import profileService from "../services/profile/profileService"


const SearchScreen = () => {
    const defaultHouseSearchData = {
        "userId": "",
        "place": "",
        "type": "",
        "pets": "",
        "dateFrom": "",
        "dateTo": "",
        "duration": 0
    }

    const defaultSitterSearchData = {
        "place": "",
        "pets": "",
        "dateFrom": "",
        "dateTo": "",
        "rating": 0,
        "duration": 0
    }

    const [houseSearchData, setHouseSearchData] = useState(defaultHouseSearchData)
    const [sitterSearchData, setSitterSearchData] = useState(defaultSitterSearchData)

    const [publications, setPublications] = useState([])
    const [filteredPublications, setFilteredPublications] = useState([])

    const session = useSession()

    const refreshPublications = () => {
        let publications = publicationService.getAllPublication()
        publications = publications.filter(p => (
            p.publication.role === (session.role === "owner" ? "sitter" : "owner") &&
            p.publication.open &&
            p.publication.userId !== session.userId
        ))
        setPublications(publications)
        setFilteredPublications(publications)
        setHouseSearchData(defaultHouseSearchData)
        setSitterSearchData(defaultSitterSearchData)
    }

    // Component did mount
    useEffect(() => {
        refreshPublications()
    }, [])

    useEffect(() => {
        // console.log(`Refreshing - Found ${filteredPublications.length} publications`)
    }, [filteredPublications, setFilteredPublications])

    useEffect(() => {
        refreshPublications()
    }, [session.role])

    const handleHouseSearch = (event) => {
        const {name, value} = event.target
        setHouseSearchData(prev => ({...prev, [name]: value}))
        let result = publications

        if (name === "duration" && value > 0) { // se acaba de actualizar este filtro -> usar filtro nuevo
            result = result.filter(p => parseInt(value) === p.publication.dateTo.diff(p.publication.dateFrom, 'day') + 1)
        } else if (houseSearchData.duration && houseSearchData.duration > 0 && name === "duration" && value > 0) { // usar filtro viejo si existia
            result = result.filter(p => parseInt(houseSearchData.duration) === p.publication.dateTo.diff(p.publication.dateFrom, 'day') + 1)
        }

        if (name === "pets" && value !== "Any") {
            result = result.filter(p => p.publication.pets.includes(value))
        } else if (houseSearchData.pets && houseSearchData.pets !== "Any" && !(name === "pets" && value === "Any")) {
            result = result.filter(p => p.publication.pets.includes(houseSearchData.pets))
        }

        if (name === "place") {
            result = result.filter(p => p.publication.place.toLowerCase().includes(value.toLowerCase()))
        } else if (houseSearchData.place) {
            result = result.filter(p => p.publication.place.toLowerCase().includes(houseSearchData.place.toLowerCase()))
        }

        if (name === "type" && value !== "Any") {
            result = result.filter(p => p.publication.type.toLowerCase().includes(value.toLowerCase()))
        } else if (houseSearchData.type && houseSearchData.type !== "Any" && !(name === "type" && value === "Any")) {
            result = result.filter(p => p.publication.type.toLowerCase().includes(houseSearchData.type.toLowerCase()))
        }

        if (name === "dateFrom") {
            result = result.filter(p => p.publication.dateFrom.isAfter(value - 1))
        } else if (houseSearchData.dateFrom) {
            result = result.filter(p => p.publication.dateFrom.isAfter(houseSearchData.dateFrom - 1))
        }

        if (name === "dateTo") {
            result = result.filter(p => p.publication.dateTo.isBefore(value + 1))
        } else if (houseSearchData.dateTo) {
            result = result.filter(p => p.publication.dateTo.isBefore(houseSearchData.dateTo + 1))
        }

        result = result.filter(p => p.publication.userId !== session.userId)

        setFilteredPublications(result)
    }

    const handleSitterSearch = (event) => {
        const {name, value} = event.target
        setSitterSearchData(prev => ({...prev, [name]: value}))
        let result = publications

        if (name === "duration" && value > 0) { // se acaba de actualizar este filtro -> usar filtro nuevo
            result = result.filter(p => parseInt(value === p.publication.dateTo.diff(p.publication.dateFrom, 'day') + 1))
        } else if (sitterSearchData.duration && sitterSearchData.duration > 0 && value > 0) { // usar filtro viejo si existia
            result = result.filter(p => parseInt(sitterSearchData.duration === p.publication.dateTo.diff(p.publication.dateFrom, 'day') + 1))
        }
        
        if (name === "rating" && value > 0) {
            result = result.filter(p => profileService.getProfile(p.publication.userId).sitterRating >= value)
        } else if (sitterSearchData.rating && sitterSearchData.rating > 0 && value > 0) {
            result = result.filter(p => profileService.getProfile(p.publication.userId).sitterRating >= sitterSearchData.rating)
        }

        if (name === "pets" && value !== "Any") {
            result = result.filter(p => p.publication.pets.includes(value))
        } else if (sitterSearchData.pets && sitterSearchData.pets !== "Any" && value !== "Any") {
            result = result.filter(p => p.publication.pets.includes(sitterSearchData.pets))
        }

        if (name === "place") {
            result = result.filter(p => p.publication.place.toLowerCase().includes(value.toLowerCase()))
        } else if (sitterSearchData.place) {
            result = result.filter(p => p.publication.place.toLowerCase().includes(sitterSearchData.place.toLowerCase()))
        }

        if (name === "dateFrom") {
            result = result.filter(p => p.publication.dateFrom.isAfter(value - 1))
        } else if (sitterSearchData.dateFrom) {
            result = result.filter(p => p.publication.dateFrom.isAfter(sitterSearchData.dateFrom - 1))
        }

        if (name === "dateTo") {
            result = result.filter(p => p.publication.dateTo.isBefore(value + 1))
        } else if (sitterSearchData.dateTo) {
            result = result.filter(p => p.publication.dateTo.isBefore(sitterSearchData.dateTo + 1))
        }

        setFilteredPublications(result)
    }

    // funcion auxiliar para tener un multiple select como elemento controlado
    // devuelve una funcion que recibe un value y usa una funcion f (que viene de un useState) para
    // actualizar la propiedad name al nuevo valor value en el json de ese state
    const setMultipleSelect = (f, name) => {
        return (value) => f(prev => ({...prev, [name]: value}))
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

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker onChange={newValue => handleHouseSearch({target: {name: "dateFrom", value: newValue}})}
                    sx={{backgroundColor: "white", width: "15%"}}
                    name="dateFrom"
                    value={dayjs(houseSearchData.dateFrom)}
                    label="Date From"
                    
                />
                <DatePicker onChange={newValue => handleHouseSearch({target: {name: "dateTo", value: newValue}})}
                    sx={{backgroundColor: "white", width: "15%"}}
                    name="dateTo"
                    value={dayjs(houseSearchData.dateTo)}
                    label="Date To"
                />
            </LocalizationProvider>
        </div>

    const sitterSearchBar =
        <div style={{padding: 10, alignItems: "center", display: "flex", justifyContent: "space-between"}}>
            <TextField onChange={handleSitterSearch}
                style={{borderRadius: 10, backgroundColor: "white", width: "20%", marginTop: 5}}
                margin="normal"
                name="place"
                value={sitterSearchData.place}
                label="🔍 Place"
                autoFocus
            >
            </TextField>

            <TextField onChange={handleSitterSearch}
                style={{borderRadius: 10, backgroundColor: "white", width: "15%", marginTop: 5}}
                margin="normal"
                name="duration"
                label={sitterSearchData.duration === 0 ? "Duration" : ""}
                autoFocus inputProps={{
                    type: "number",
                    min: 0,
                    "aria-label": "Duration",
                }}
                InputLabelProps={{
                    shrink: sitterSearchData.duration !== 0 && sitterSearchData.duration !== '',
                }}
            >
            </TextField>

            <MultipleSelect handleChange={handleSitterSearch}
                style={{width: "15%"}}
                name="pets"
                data={[sitterSearchData.pets, setMultipleSelect(setSitterSearchData, "pets")]}
                options={[...petTypes, "Any"]}
                label="Pets"
                multiple={false}
            />

            <TextField onChange={handleSitterSearch}
                style={{borderRadius: 10, backgroundColor: "white", width: "15%", marginTop: 5}}
                margin="normal"
                name="rating"
                label={sitterSearchData.rating === 0 ? "Rating" : ""}
                autoFocus inputProps={{
                    type: "number",
                    min: 0,
                    max: 5,
                    step: 0.5,
                    "aria-label": "Rating",
                }}
                InputLabelProps={{
                    shrink: sitterSearchData.rating !== 0 && sitterSearchData.rating !== '',
                }}
            >
            </TextField>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker onChange={newValue => handleSitterSearch({target: {name: "dateFrom", value: newValue}})}
                    sx={{backgroundColor: "white", width: "15%"}}
                    name="dateFrom"
                    value={dayjs(sitterSearchData.dateFrom)}
                    label="Date From"
                    
                />
                <DatePicker onChange={newValue => handleSitterSearch({target: {name: "dateTo", value: newValue}})}
                    sx={{backgroundColor: "white", width: "15%"}}
                    name="dateTo"
                    value={dayjs(sitterSearchData.dateTo)}
                    label="Date To"
                />
            </LocalizationProvider>
        </div>

    const housesElement = session.role === "sitter" &&
        <div style={{padding: 10}}>
            <Grid container spacing={3} direction="row" justify="flex-start" alignItems="flex-start">
                {filteredPublications.map(elem => (
                    <Grid item xs={12} sm={6} md={3} key={filteredPublications.indexOf(elem)}>
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
                            postulations={[...elem.publication.postulationIds]
                                .map(pId => ({...postulationService.getPostulation(pId), id: pId}))
                                .filter(p => p.state !== "Declined")}
                            postulation={false}
                            refresh={refreshPublications}
                        >
                        </HouseCard>
                    </Grid>
                ))}
            </Grid>
        </div>
    
    const sittersElement = session.role === "owner" &&
        <div style={{padding: 10}}>
            <Grid container spacing={3} direction="row" justify="flex-start" alignItems="flex-start">
                {filteredPublications.map(elem => (
                    <Grid item xs={12} sm={6} md={3} key={filteredPublications.indexOf(elem)}>
                        <ProfileCard
                            publicationId={elem.hashId}
                            userId={elem.publication.userId}
                            title={elem.publication.title}
                            description={elem.publication.description}
                            place={elem.publication.place}
                            type={elem.publication.type}
                            pets={elem.publication.pets}
                            date={formatDate(elem.publication.dateFrom, elem.publication.dateTo)}
                            imgs={elem.publication.imgs}
                            postulations={[...elem.publication.postulationIds]
                                .map(pId => ({...postulationService.getPostulation(pId), id: pId}))
                                .filter(p => p.state !== "Declined")}
                            postulation={false}
                            refresh={refreshPublications}
                        >
                        </ProfileCard>
                    </Grid>
                ))}
            </Grid>
        </div>

    return (
        <div>
            {session.role === "owner" ? sitterSearchBar : houseSearchBar}
            {session.role === "owner" ? sittersElement : housesElement}
        </div>
    )
}

export default SearchScreen
