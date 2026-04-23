TravelBuddy!

The Swiss Army knife of all travellers!

This small but useful project lets you plan out trips and later share the memories from the trip with everyone!

You are able to convert currencies from all over the world, check interesting places where you are going and lastly show everyone what you did!

Tech stack:
- React.js as framework
- Javascript as front-end language
- Node.js as back-end language
- MongoDB as database

APIs used:
- Cloudinary for storage
- ExchangeRate-API for currency exchange
- Opentripmap for places and info

AI used:
AI was used for sketching and to look for APIs that could be implemented on the project. All ideas were made by me, the AI worked for me and made my vision be achievable in such a short period of time.
Used Claude's free tier for the whole project, tried to do it as a challenge to make the prompts as optimized as possible.

Setup instructions:
Need to install dependencies on both ./server and ./Travel-Buddy, using npm install. 
The .env file should be set up on ./server, follow the .env-example with your own variables
When running locally, please run npm run dev on ./server first, which will create a local server in port 5000.
Then run npm run dev on ./Travel-buddy, which will open a browser page where you will be able to interact with the page.

Trade offs and improvements:
- Left all the things to create users and logins open, just need to add a little more time to implement it, I would like to add the functionality to add favorite places, maybe even comment on someone elses pictures
- Since no login has been implemented yet, and the pictures are public to everyone, so is the possibility to eliminate them, meaning anyone can delete anyones pictures, which can be a big problem, however this can be easily fixed with implementing users and logins
- Make it so each picture has a geotag people can use to see exactly where it was taken
- Add average prices and images to places Open trip sends, the API isnt sending the pictures so i decided to leave a long description for now
- Polish on the whole look and feel of the site, left a little to the side due to time constraints
- testing wasnt implemented as such (Like with Jest or Cypress), but all fetches have an error message handler in which it will let you know whats wrong with the API in case something goes wrong!
