import data from "./postulationsData";
import sjcl from "sjcl";
import publicationService from "../publication/publicationService";
import profileService from "../profile/profileService";

class PostulationService {
    stored_postulation
    cant
    constructor(defaultData) {
        this.stored_postulation = new Map();
        defaultData.forEach((elem, i) => {
            const hash = getHash(Math.floor(Date.now() / 1000) + i)
            this.stored_postulation.set(hash, elem)});
    }

    storePostulation = (postulation) => {
        const hash = getHash(Math.floor(Date.now() / 1000) + this.stored_postulation.size);
        this.stored_postulation.set(hash, postulation);
        publicationService.addPostulation(postulation.publicationId, hash)
        return hash;
    }

    getPostulation = (hashId) => {
        return this.stored_postulation.get(hashId);
    }

    getAllPostulation = () => {
        let arr = []
        this.stored_postulation.forEach((value, key, map) => {
            arr.push({hashId: key, postulation: value});
        })
        return arr;
    }

    editPostulation = (hashId, data) => {
        this.stored_postulation.set(hashId, {
            ...this.getPostulation(hashId),
            ...data
        })
    }

    deletePostulation = (hashId) => {
        let postulation = this.getPostulation(hashId);
        publicationService.removePostulation(postulation.publicationId, hashId)
        this.stored_postulation.delete(hashId);
        return "OK"
    }

    getUserPostulations = (id) => {
        let arr = []
        this.stored_postulation.forEach((value, key, map) => {
            // chequeo que sea una postulacion valida con datos, antes de pushearla
            value.state && arr.push({hashId: key, postulation: value});
        })
        return arr.filter(p => p.postulation.userId.toLowerCase() === id);
    }
}

function getHash(toHash) {
    const myBitArray = sjcl.hash.sha256.hash(toHash)
    return sjcl.codec.hex.fromBits(myBitArray);
}


const postulationService = new PostulationService(data);
export default postulationService
