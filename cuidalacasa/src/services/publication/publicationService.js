import data from "./publicationsData";
import sjcl from "sjcl";
import postulationService from "../postulation/postulationService";

class PublicationService {
    stored_publication
    cant
    constructor(defaultData) {
        this.stored_publication = new Map();
        defaultData.forEach((elem, i) => {
            // const hash = getHash(Math.floor(Date.now() / 1000) + i);
            // this.stored_publication.set(hash, elem);
            this.storePublication(elem)
        })
    }

    storePublication = (publication) => {
        const hash = getHash(Math.floor(Date.now() / 1000) + this.stored_publication.size);
        this.stored_publication.set(hash, publication)
        return hash;
    }

    getPublication = (hashId) => {
        return this.stored_publication.get(hashId);
    }

    deletePublication = (hashId) => {
        let publication = this.getPublication(hashId);
        publication.postulationIds.forEach(postulationId => {
            postulationService.deletePostulation(postulationId)
        })
        this.stored_publication.delete(hashId);
    }

    getAllPublication = () => {
        let arr = []
        this.stored_publication.forEach((value, key, map) => {
            arr.push({hashId: key, publication: value});
        })
        return arr;
    }

    editPublication = (hashId, data) => {
        this.stored_publication.set(hashId, {
            ...this.getPublication(hashId),
            ...data
        })
    }

    addPostulation = (publicationId, postulationId) => {
        let publication = this.getPublication(publicationId);
        publication.postulationIds.add(postulationId)
    }
    
    removePostulation = (publicationId, postulationId) => {
        let publication = this.getPublication(publicationId);
        publication.postulationIds.delete(postulationId)
    }

    getUserPublications = (id) => {
        let arr = []
        this.stored_publication.forEach((value, key, map) => {
            arr.push({hashId: key, publication: value});
        })
        return arr.filter(p => p.publication.userId.toLowerCase() === id);
    }
}

function getHash(toHash) {
    const myBitArray = sjcl.hash.sha256.hash(toHash)
    return sjcl.codec.hex.fromBits(myBitArray);
}


const publicationService = new PublicationService(data);
export default publicationService

