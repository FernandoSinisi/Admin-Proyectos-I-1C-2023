import {useState, useEffect} from "react"
import { useNavigate } from "react-router"

import {Grid, TextField} from "@mui/material"

import {useSession} from "../auth/auth"
import publicationService from "../services/publication/publicationService"
import postulationService from "../services/postulation/postulationService"

import HouseCard from "../components/houseCard"
import MultipleSelect from "../components/multipleSelect"

import ProfileCard from "../components/profileCard"

const PostulationScreen = () => {
    const defaultSearchData = {
        "place": "",
        "state": []
    }

    const [searchData, setSearchData] = useState(defaultSearchData)

    const [postulations, setPostulations] = useState(postulationService.getAllPostulation())
    const [filteredPostulations, setFilteredPostulations] = useState([])

    const navigate = useNavigate()
    const session = useSession()

    const refreshPostulations = () => {
        let postulations = postulationService.getAllPostulation()
        postulations = postulations.filter(p =>
            p.postulation.userId === session.userId &&
            p.postulation.role === session.role
        )
        setPostulations(postulations)
        setFilteredPostulations(postulations)
        setSearchData(defaultSearchData)
    }

    useEffect(() => {
        refreshPostulations()
    }, []);

    useEffect(() => {
        // console.log(`Refreshing - Found ${filteredPostulations.length} postulations`)
    }, [filteredPostulations, setFilteredPostulations])

    const handleSearch = (event) => {
        const {name, value} = event.target
        setSearchData(prev => ({...prev, [name]: value}))
        let result = postulations

        if (name === "place") { // se acaba de actualizar este filtro -> usar filtro nuevo
            result = result.filter(p => (publicationService.getPublication(p.postulation.publicationId).place.toLowerCase().includes(value.toLowerCase())))
        } else if (searchData.place) { // usar filtro viejo si existia
            result = result.filter(p => (publicationService.getPublication(p.postulation.publicationId)).place.toLowerCase().includes(searchData.place.toLowerCase()))
        }
        
        if (name === "state" && value.length > 0) {
            result = result.filter(p => value.includes(p.postulation.state))
        } else if (searchData.state.length > 0 && value.length > 0) {
            result = result.filter(p => searchData.state.includes(p.postulation.state))
        }

        setFilteredPostulations(result)
    }

    // funcion auxiliar para tener un multiple select como elemento controlado
    // devuelve una funcion que recibe un value y usa una funcion f (que viene de un useState) para
    // actualizar la propiedad name al nuevo valor value en el json de ese state
    const setMultipleSelect = (f, name) => {
        return (value) => f(prev => ({...prev, [name]: value}))
    }

    // owner = dueño de la publicacion, que puede ser una casa o un perfil
    const handleOpenChat = (ownerId) => {
        session.focusChat()
        navigate("/chat", {
            state: {
                emitterId: session.userId,
                receptorId: ownerId
            }
        })
    }

    const postulationSearchBar =
        <div style={{padding: 10, alignItems: "center", display: 'flex', justifyContent: "flex-start", gap: "1rem"}}>
            <TextField onChange={handleSearch}
                value={searchData.place}
                margin="normal"
                label="🔍 Place"
                name="place"
                style={{borderRadius: 10, backgroundColor: "white", width: "20%", marginTop: 6}}
                autoFocus
            />
            <MultipleSelect
                handleChange={handleSearch}
                data={[searchData.state, setMultipleSelect(setSearchData, "state")]}
                options={["Pending", "Accepted", "Declined"]}
                label="State"
                name="state"
                multiple={true}
                style={{width: "20%"}}
            />
        </div>
    
    const housesElement = session.role === "sitter" &&
        <div style={{padding: 10}}>
            <Grid container spacing={3} direction="row" justify="flex-start" alignItems="flex-start">
                {filteredPostulations.map(elem => {
                    const publication = publicationService.getPublication(elem.postulation.publicationId)
                    return (
                        <Grid item xs={12} sm={6} md={3} key={filteredPostulations.indexOf(elem)}>
                            <HouseCard
                                imgs={publication.imgs} title={publication.title} pets={publication.pets}
                                dateTo={publication.dateTo} dateFrom={publication.dateFrom}
                                place={publication.place} description={publication.description}
                                state={elem.postulation.state} comment={elem.postulation.comment}
                                postulationId={elem.hashId} applicantId={elem.postulation.userId}
                                ownerId={elem.postulation.ownerId} publicationId={elem.postulation.publicationId}
                                role={elem.postulation.role}
                                postulation={true}

                                openChat={handleOpenChat}
                                refresh={refreshPostulations}
                            >
                            </HouseCard>
                        </Grid>
                    )
                })}
            </Grid>
        </div>
    
    const profilesElement = session.role === "owner" &&
    <div style={{padding: 10}}>
    <Grid container spacing={3} direction="row" justify="flex-start" alignItems="flex-start">
        {filteredPostulations.map(elem => {
            const publication = publicationService.getPublication(elem.postulation.publicationId)
            return (
                <Grid item xs={12} sm={6} md={3} key={filteredPostulations.indexOf(elem)}>
                    <ProfileCard
                        imgs={publication.imgs} title={publication.title} pets={publication.pets}
                        dateTo={publication.dateTo} dateFrom={publication.dateFrom}
                        place={publication.place} description={publication.description}
                        state={elem.postulation.state} comment={elem.postulation.comment}
                        postulationId={elem.hashId} applicantId={elem.postulation.userId}
                        userId={elem.postulation.userId}
                        ownerId={elem.postulation.ownerId} publicationId={elem.postulation.publicationId}
                        role={elem.postulation.role}
                        postulation={true}

                        openChat={handleOpenChat}
                        refresh={refreshPostulations}
                    >
                    </ProfileCard>
                </Grid>
            )
        })}
    </Grid>
</div>
    
    return (
        <div style={{padding: 10}}>
            {postulationSearchBar}
            {housesElement}
            {profilesElement}
        </div>
    )

}

export default PostulationScreen