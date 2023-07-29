import sjcl from "sjcl";

class VeterinaryService {
    stored_veterinary
    cant
    constructor() {
        this.stored_veterinary = new Map();
    }

    storeVeterinary = (veterinary) => {
        const hash = getHash(Math.floor(Date.now() / 1000) + this.stored_veterinary.size);
        this.stored_veterinary.set(hash, veterinary)
        return hash;
    }

    getVeterinary = (hashId) => {
        return this.stored_veterinary.get(hashId);
    }

    deleteVeterinary = (hashId) => {
        this.stored_veterinary.delete(hashId);
    }

    getAllVeterinary = () => {
        let arr = []
        this.stored_veterinary.forEach((value, key, map) => {
            arr.push({hashId: key, veterinary: value});
        })
        return arr;
    }

    editVeterinary = (hashId, data) => {
        this.stored_veterinary.set(hashId, {
            ...this.getVeterinary(hashId),
            ...data
        })
    }

    addPostulation = (veterinaryId, postulationId) => {
        let veterinary = this.getVeterinary(veterinaryId);
        veterinary.postulationIds.add(postulationId)
    }
    
    removePostulation = (veterinaryId, postulationId) => {
        let veterinary = this.getVeterinary(veterinaryId);
        veterinary.postulationIds.delete(postulationId)
    }

    getUserVeterinarys = (id) => {
        let arr = []
        this.stored_veterinary.forEach((value, key, map) => {
            arr.push({hashId: key, veterinary: value});
        })
        return arr.filter(p => p.veterinary.userId.toLowerCase() === id);
    }
}

function getHash(toHash) {
    const myBitArray = sjcl.hash.sha256.hash(toHash)
    return sjcl.codec.hex.fromBits(myBitArray);
}

const veterinaryService = new VeterinaryService();
export default veterinaryService
