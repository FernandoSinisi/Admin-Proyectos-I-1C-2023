import initialData from "./profilesData"

class ProfileService {
    profiles
    constructor(initialData) {
        this.profiles = initialData
    }
    addProfile(profile) {
        this.profiles.push({
            userId: "",
            name: "",
            lastName: "",
            email:"",
            age: "",
            country: "",
            description: "",
            picture: "",
            pets: [],
            amount: "",
            rating: "",
            subscription: "",
            ...profile
        })
    }

    getProfile(id) {
        return this.profiles.filter(p => p.userId === id)[0]
    }

    /**
     * 
     * @param {*} filters 
     * @param {*} sort 
     */
    getProfiles({filters, sort}) {
        const filteredProfiles = this.profiles.filter(p => {
            for (let key in filters) {
                if (p[key] !== filters[key]) {
                    return false
                }
            }
            return true
        })

        if (sort) {
            filteredProfiles.sort((a, b) => {
                const sortOrder = sort.order === "asc" ? 1 : -1
                if (a[sort.att] < b[sort.att]) {
                    return -1 * sortOrder;
                } else if (a[sort.att] > b[sort.att]) {
                    return 1 * sortOrder;
                } else {
                    return 0;
                }
            })
        }

        return filteredProfiles
    }

    getAllProfiles() {
        return this.profiles
    }

    editProfile(newData) {
        this.profiles = this.profiles.map(p => (
            p.userId === newData.userId ?
                {...p, ...newData} :
                p
        ))
        return this.getProfile(newData.userId)
    }

    deleteProfile(id) {
        this.profiles = this.profiles.filter(p => p.userId !== id)
    }
}

const profileService = new ProfileService(initialData)
export default profileService
