import dayjs from 'dayjs';

const publicationsData = [
    {
        postulationIds: new Set(),
        imgs: [
            require('../../img/publications/casa1/casa1.jpeg'),
            require('../../img/publications/casa1/casa1-2.jpeg'),
            // require('../../img/publications/casa1/casa1-3.jpeg'),
            // require('../../img/publications/casa1/casa1-4.jpeg'),
            // require('../../img/publications/casa1/casa1-5.jpeg'),
            // require('../../img/publications/casa1/casa1-6.jpeg'),
        ],
        title: "West Hollywood Cats Need a Babysitter and a Friend.",
        dateFrom: dayjs('2023-07-07'),
        dateTo: dayjs('2023-07-23'),
        place: "West Hollywood, CA, US",
        type: "🏠 House",
        pets: ["🐕 Dog"],
        userId: "3",
        description: "Hello! We are a family of three (plus Luke and Leia), working as independent filmmakers and living in a little two-bedroom bungalow. We're off to Europe and the kitties need a companion.",
        open: true,
        role: "owner"
    },
    {
        postulationIds: new Set(),
        imgs: [
            require('../../img/publications/casa2/casa2.jpeg'),
            require('../../img/publications/casa2/casa2-1.jpeg'),
            require('../../img/publications/casa2/casa2-2.jpeg'),
            require('../../img/publications/casa2/casa2-3.jpeg'),
            require('../../img/publications/casa2/casa2-4.jpeg'),
            require('../../img/publications/casa2/casa2-5.jpeg'),
            // require('../../img/publications/casa2/casa2-6.jpeg')
        ],
        title: "Sweet stay in Highland Park, must love felines!",
        dateFrom: dayjs('2023-06-08'),
        dateTo: dayjs('2023-06-29'),
        place: "Los Angeles, CA, US",
        type: "🏠 House",
        pets: ["🐕 Dog", "🐈 Cat"],
        userId: "3",
        description: "Tengo 3 perros super cariñosos para cuidar, brindo todas las comodidades del hogar, wifi, servicio de cable, estacionamiento, aire acondicionado, etc. Esta ubicado en zona comercial.",
        open: true,
        role: "owner"
    },
    {
        postulationIds: new Set(),
        imgs: [
            require('../../img/publications/casa3/casa3.jpeg'),
            require('../../img/publications/casa3/casa3-1.jpeg'),
            require('../../img/publications/casa3/casa3-2.jpeg'),
            require('../../img/publications/casa3/casa3-3.jpeg'),
            require('../../img/publications/casa3/casa3-4.jpeg'),
            require('../../img/publications/casa3/casa3-5.jpeg'),
            require('../../img/publications/casa3/casa3-6.jpeg')
        ],
        title: "Looking for a trusted sitter from 28 June to 17 July in Rome, Italy",
        dateFrom: dayjs('2023-06-28'),
        dateTo: dayjs('2023-07-17'),
        place: "Rome, Italy",
        type: "🏠 House",
        pets: ["🐕 Dog", "🐠 Fish"],
        userId: "3",
        description: "Tengo 2 gatos, uno macho y otra hembra que necesitan particular atencion, estaré pendiente de su cuidado.",
        open: true,
        role: "owner"
    },
    {
        postulationIds: new Set(),
        imgs: [
            require('../../img/publications/casa4/casa4.jpeg'),
            require('../../img/publications/casa4/casa4-1.jpeg'),
            require('../../img/publications/casa4/casa4-2.jpeg'),
            require('../../img/publications/casa4/casa4-3.jpeg'),
            require('../../img/publications/casa4/casa4-4.jpeg'),
            require('../../img/publications/casa4/casa4-5.jpeg'),
            require('../../img/publications/casa4/casa4-6.jpeg'),
            require('../../img/publications/casa4/casa4-7.jpeg'),
        ],
        title: "Five days with four amazing cats and a bunch of tropical plants",
        date: "14 Nov 2023 - 19 Nov 2023",
        dateFrom: dayjs('2023-11-14'),
        dateTo: dayjs('2023-11-19'),
        place: "Capelle aan den IJssel, Netherlands",
        type: "🏠 House",
        pets: ["🐕 Dog", "🐈 Cat", "🐇 Rabbit"],
        userId: "3",
        description: "Tengo 2 gatos, uno macho y otra hembra que necesitan particular atencion, estaré pendiente de su cuidado.",
        open: true,
        role: "owner"
    },
    {
        postulationIds: new Set(),
        imgs: [
            require('../../img/publications/casa5/casa5.jpeg'),
            require('../../img/publications/casa5/casa5-1.jpeg'),
            require('../../img/publications/casa5/casa5-2.jpeg'),
            require('../../img/publications/casa5/casa5-3.jpeg'),
            require('../../img/publications/casa5/casa5-4.jpeg'),
            require('../../img/publications/casa5/casa5-5.jpeg'),
            require('../../img/publications/casa5/casa5-6.jpeg')
        ],
        title: "A weekend stay in NYC with Potato",
        dateFrom: dayjs('2023-12-19'),
        dateTo: dayjs('2023-12-21'),
        place: "New York City, NY, US",
        pets: [],
        type: "🏢 Appartment",
        userId: "4",
        description: "Tengo 2 gatos, uno macho y otra hembra que necesitan particular atencion, estaré pendiente de su cuidado.",
        open: true,
        role: "owner"
    },
    {
        postulationIds: new Set(),
        imgs: [
            require('../../img/publications/casa6/casa6.jpeg'),
            require('../../img/publications/casa6/casa6-1.jpeg'),
            require('../../img/publications/casa6/casa6-2.jpeg'),
            require('../../img/publications/casa6/casa6-3.jpeg'),
            require('../../img/publications/casa6/casa6-4.jpeg'),
            require('../../img/publications/casa6/casa6-5.jpeg'),
            require('../../img/publications/casa6/casa6-6.jpeg')
        ],
        title: "Lovely Berlin House with three easy going friends: two cats, one dog",
        dateFrom: dayjs('2023-07-05'),
        dateTo: dayjs('2023-07-14'),
        place: "Berlin, Germany",
        type: "🏢 Appartment",
        pets: ["🐈 Cat"],
        userId: "4",
        description: "Tengo 3 gatos, uno macho y dos hembras que necesitan particular atencion, estaré pendiente de su cuidado.",
        open: true,
        role: "owner"
    }
]
export default publicationsData;
