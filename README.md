# Whisker Weekends REST API

## About
* REST API (built in Express and MongoDB) for a web app that allows users to connect with fellow pet owners and arrange playdates for their furry friends

* Users can create profiles, add profiles for their pets, organize, view and like playdates, add "pet friendly places" to our database, view other user's profiles and chat with one another on the platform. 

* A repository with the frontend (React App) can be found here: [Link text](https://github.com/dumpling-charlie/whisker-weekends-client)

## Instructions
To run in your computer, follow these steps:
* clone
* install dependencies: `npm install` `npm i cloudinary multer multer-storage-cloudinary socket.io`
* create a `.env` file with the following environment variables
    * PORT=3000
    * ORIGIN=https://whisker-weekends.netlify.app/
    * TOKEN_SECRET: used to sign auth tokens
    * CLOUDINARY_NAME=<your_cloudinary_name>
    * CLOUDINARY_KEY=<your_cloudinary_key>
    * CLOUDINARY_SECRET=<your_cloudinary_secret>
* Replace <your_session_secret>, <your_cloudinary_name>, <your_cloudinary_key>, and <your_cloudinary_secret> with your own values.

* To obtain Cloudinary credentials, you'll need to create an account on the Cloudinary website: [Link text](https://cloudinary.com/). After signing up, you can find your cloud_name, api_key, and api_secret on the dashboard.

* After setting up the environment variables in the .env file, your "whisker-weekends-server" app should now be properly configured to run on your local machine.

* to run the application: `npm run dev`

## API Endpoints

<br/>

**auth Endpoints**

| HTTP verb   | Path | Request Headers | Request body  | Description |
| ------------- | ------------- | ------------- |------------- | ------------- |
| POST  | /api/auth/signup  | –  | { email: String, password: String, name: String, location: String, bio: String }  | Create an account  |
| POST  | /api/auth/login  | –  | { email: String, password: String }  | Login  |
| GET  | /api/auth/verify  | Authorization: Bearer `<jwt>`  | –  | Verify jwt  |

<br/>

**Playdates**

| HTTP verb   | Path | Request Headers | Request body  | Description |
| ------------- | ------------- | ------------- |------------- | ------------- |
| GET | /api/playdates/  | -  | -  | Get all playdates  |
| GET  | /api/projects/:playdateId  | Authorization: Bearer `<jwt>`  | –  | Get playdate details  |
| POST  | /api/playdates/ | Authorization: Bearer `<jwt>` | { imageUrl: String, title: String, location: String, date: Date, time: String, pets: Schema.Types.ObjectId, description: String } | Create new playdate  |
| PUT  | /api/playdates/:playdateId/like  | Authorization: Bearer `<jwt>`  | - | Like a playdate  |
| PUT  | /api/playdates/:playdateId  | Authorization: Bearer `<jwt>`  | { imageUrl: String, title: String, location: String, date: Date, time: String, description: String } | Edit a playdate |
| DELETE  | /api/playdates/:playdateId  | Authorization: Bearer `<jwt>`  | - | Delete a playdate |

<br/>

**Pets**

| HTTP verb   | Path | Request Headers | Request body  | Description |
| ------------- | ------------- | ------------- |------------- | ------------- |
| GET | /api/pets | Authorization: Bearer `<jwt>`  | {owner: userId}  | Get list of your own pets  |
| GET  | /api/pets/:petId  | Authorization: Bearer `<jwt>`  | –  | Get pet profile details  |
| POST  | /api/pets | Authorization: Bearer `<jwt>` | { name: String, age: Number, species: String, breed: String, personality: String, imageUrl: String } | Create new pet  |
| PUT  | /api/pets/:petId  | Authorization: Bearer `<jwt>`  | { name: String, age: Number, personality: String, imageUrl: String } | Edit pet profile  |
| DELETE  | /api/pets/:petId | Authorization: Bearer `<jwt>`  | - | Delete a pet |

<br/>

**Pet Friendly Places**

| HTTP verb   | Path | Request Headers | Request body  | Description |
| ------------- | ------------- | ------------- |------------- | ------------- |
| GET | /api/friendly/ | -  | -  | Get list of pet friendly places  |
| GET  | /api/friendly/friendlyPlaceId  | - | –  | Get pet pet friendly place details  |
| POST  | /api/firendly/create | Authorization: Bearer `<jwt>` | { name: String, location: String, details: String, createdBy: userId } | Create new pet friendly place  |
| PUT  | /api/friendly/:friendlyPlaceId/like | Authorization: Bearer `<jwt>`  | - | Like a pet friendly place  |

<br/>

**User**

| HTTP verb   | Path | Request Headers | Request body  | Description |
| ------------- | ------------- | ------------- |------------- | ------------- |
| GET | /profile/:userId | Authorization: Bearer `<jwt>`  | - | Get profile details  |
| PUT  | /api/profile/:userId  | Authorization: Bearer `<jwt>`  | { name: String, location: String, imageUrl: String, bio: String } | Edit user profile  |

<br/>

## Demo
A demo of the REST API can be found here: [Link text](https://whisker-weekends.netlify.app/)