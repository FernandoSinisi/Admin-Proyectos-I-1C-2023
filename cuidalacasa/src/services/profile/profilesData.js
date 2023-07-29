import img1 from "../../img/profiles/camilo.png"
import img2 from "../../img/profiles/karenfede.png"
import img3 from "../../img/profiles/jose.png"

import { petTypes } from "../../others/constants"

export default [
    {
        userId: "1",
        name: "Camilo",
        lastName: "Ramirez",
        email:"camilo.pramirez@outlook.com",
        age: 25,
        country: "Argentina",
        sitterDescription: "Mochilero",
        ownerDescription: "lorem ipsum dolor",
        picture: img1,
        pets: [
            petTypes[0]
        ],
        amount: 1,
        sitterRating: 1,
        ownerRating: 0,
        subscription: "Basic",
        contact:"54+91100029201"
    },
    {
        userId: "2",
        name: "Karen y Federico",
        lastName: "",
        email:"karenfede.flia@gmail.com",
        age: 30,
        country: "Argentina",
        sitterDescription: "lorem ipsum dolor",
        ownerDescription: "lorem ipsum dolor",
        picture: img2,
        pets: [
            petTypes[0]
        ],
        amount: 2,
        sitterRating: 5,
        ownerRating: 3,
        subscription: "Standard",
        contact:"54+91100029111"
    },
    {
        userId: "3",
        name: "José",
        lastName: "Empresario",
        email:"joseffsouto@gmail.com",
        age: 35,
        country: "Uruguay",
        sitterDescription: "lorem ipsum dolor",
        ownerDescription: "lorem ipsum dolor",
        picture: img3,
        pets: [
            petTypes[0]
        ],
        amount: 1,
        sitterRating: 0,
        ownerRating: 4,
        subscription: "Premium",
        contact:"54+91100022222"
    },
    {
        userId: "4",
        name: "Violeta",
        lastName: "Santillan",
        email:"violeta.santillan@outlook.com",
        age: 35,
        country: "Argentina",
        sitterDescription: "lorem ipsum dolor",
        ownerDescription: "lorem ipsum dolor",
        picture: null,
        pets: [
            petTypes[0]
        ],
        amount: 1,
        sitterRating: 0,
        ownerRating: 0,
        subscription: "Premium",
        contact:"54+91100033333"
    }
]
