import sjcl from "sjcl";

class RatingService {
    stored_rating
    cant

    constructor(defaultData) {
        this.stored_rating = new Map();
        defaultData.forEach((elem, i) => {
            const hash = getHash(Math.floor(Date.now() / 1000) + i)
            this.stored_rating.set(hash, elem)});
    }

    storeRating = (rating) => {
        const hash = getHash(Math.floor(Date.now() / 1000) + this.stored_rating.size);
        const inverseRating = this.getAllRating().filter(r => r.rating.publicationId === rating.publicationId)
        this.stored_rating.set(hash, rating);

        if (inverseRating.length > 0) {
            this.editRating(inverseRating[0].hashId, {public: true})
            this.editRating(hash, {public: true})
        }

        return hash;
    }

    getRating = (hashId) => {
        return this.stored_rating.get(hashId);
    }

    getAllRating = () => {
        let arr = []
        this.stored_rating.forEach((value, key, map) => {
            arr.push({hashId: key, rating: value});
        })
        return arr;
    }

    editRating = (hashId, data) => {
        this.stored_rating.set(hashId, {
            ...this.getRating(hashId),
            ...data
        })
    }

    deleteRating = (hashId) => {
        let rating = this.getRating(hashId);
        publicationService.removeRating(rating.publicationId, hashId)
        return this.stored_rating.delete(hashId);
    }
}

function getHash(toHash) {
    const myBitArray = sjcl.hash.sha256.hash(toHash)
    return sjcl.codec.hex.fromBits(myBitArray);
}


const ratingService = new RatingService([]);
export default ratingService
