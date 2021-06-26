# Run-Mania
A running app that generates a looping route for you based on the distance you set. 
Compete and challenge with your friends as you level up through running! 

## Scope of Project
A mobile application using React Native that generates suitable routes of a specific distance for running and logs them while having gamification features. 

## Motivation 
Ever felt unhealthy and have been putting on some weight? Unwilling to go for runs because of the same old route all the time? Perhaps during runs, you start to lose motivation as you run through the repetitive scenery just to clock your mileage. 

Most people can relate to such thoughts, having realised that they are out of shape. Everyone can acknowledge their lifestyle choices might not be the healthiest. However, after acknowledging, very few are willing to take it one step further to make changes in their lifestyle, citing reasons such as laziness or the lack of any incentives. Hence, we want to increase the conversion rate from acknowledgement to action. 

## Aim 
We hope to make an application that generates a route of X distance based on the user’s input in such a way that the user completes his/her jog in just one round and also having intentions to gamify the application to reach out to the gaming community. 

## User Stories
1. As a user, I have always found that repeated rounds around a park/stadium boring and tires me out faster, I want to be able to pick a route based on distance.
2. As a user, I want to be able to easily pick a new route of a longer distance as I progressively improve on running. 
3. As a user, I want to be able to compare with my friends.
4. As a user, I want to track and log all my runs, so that I can view them all in the future. 
5. As a friend, I want to be able to compare and compete against other friends.
6. As a user, I want to time my runs and and other information. 

## Features
### Auto-routing
The core feature of this application. Randomly generates a route of a specified distance, given by the user's input. The accuracy of this auto generation is set to ±250m from the user's input.

### Tracking of runs
Users will be able to track their real-time location and time elapsed as they run the route. 

### Running Logs
Users can view all their past runs that are logged in this application.

### Account features
All users can create an account which stores all running logs, friends, etc. To make changes to their account such as their username, email or password, they can do so in the settings page. 

### Leaderboard
This is where users can view the standings against other friends registered on this application. 

### Gamification
Earn experience by running! Required experience to level up is calculated by ( Current level * 2 ) kilometres. Level up to increase stats and get stronger in order to dominate your friends (and secure bragging rights!) in a real-time turn-based PvP combat.

### Settings
Allows users to edit their username, email or password. 

### Friends
Allows users to send friend requests with their unique ID code. Once they become friends on the app, they will be able to view the avatar and stats of others.

## Development Plan
Currently implemented: 
- Account features
- Auto routing
- Running logs
- Leaderboard
- Settings

To be completed by July:
- Improve project with suggestions from peer teams
- Gamification features

## Tech Stack
- React Native with Javascript
- Expo, Expo Go
- Firebase
- Google Maps
- Geolocation 

## System Design

### Backend
This application uses Firebase as its backend as well as its database. 

### Frontend
This application uses React Native in conjunciton with Expo's managed workflow to allow our app to be easily published and run on both android and iOS platforms. 

### Data Flow
![image](https://user-images.githubusercontent.com/77159295/122953117-0e72aa80-d3b1-11eb-98d4-d1a952853f06.png)
![image](https://user-images.githubusercontent.com/77159295/122953396-42e66680-d3b1-11eb-853a-f529f7294e57.png)

## Software Development Process
### Auto routing
------
To achieve the auto routing, we first use Expo's location module the retrieve user's current location as the point of origin, then we use another module from npmjs library which allows us to pick a random point on a circle from a set radius (using the same distance defined by the user). We use this module to find 2 points, and together with the origin as the starting and ending point, we are able to request a route from Google Directions API to generate the route for us. 

We only find 2 random points because this ensures a loop from start to finish. 
With only 2 random points, the route generated on a 2D map will become a proper loop, whereas with 3 or more random points, the route generated may or may not be give us a loop (as illustrated below).
![image](https://user-images.githubusercontent.com/77159295/123443823-d4034a80-d608-11eb-94b2-e0e5bdbb90f2.png)

The distance of the generated route will never always be the distance desired by the user. 
Therefore, we recursively do the following: 
- check the distance of the route
- if it is within 250m of the desired distance, we show the user the route
- otherwise, we request from Google Directions API again for another route

### Tracking the run
------
At every position change, the app records down the user's new location and appends in to the back of an array. This array stores elements containing the latitude and longitude values of the user during their run, thus allowing us to dynamically plot a line on the map as the user moves. A simple timer is implemented by incrementing a variable by 1 at every 1s intervals. However, the tricky part to implement is when the app is backgrounded but we stil want it to continue tracking. 

When the app is backgrounded, we want track of only 2 things, the timer and location. 
For the timer, timestamp is recorded the moment the app goes into the "background" and into the "active" state, then taking the time between this 2 timestamps and add it to the timer variable.
For the location, we will have to request for both foreground and background location services permissions on the user's phone. With the background location services granted, the application will be able to constantly update the locations array and hence continue tracking the user. Once the app state changes back into "active", the background tracking stops while the foreground tracking resumes. 
#### **However, background location tracking DOES NOT work on physical iOS devices unless we build the application, which requires an Apple Developer Account**
This is a limitation by the Expo Client for iOS devices specifically (see [here](https://forums.expo.io/t/background-location-not-working/23433/3)).
We have tested the background location tracking to be working on iOS simulator, Android Studio and a phyiscal android device. 
Therefore, if you want to test on a physical iOS device, you have to leave it unlocked. 

### Firebase Usage
------
We use Firebase to keep track of all the data such as the user's stats, past runs (statistics + array of user locations), which user is friends with who, and to implement the leaderboard and PvP functions.

For the leaderboard, 
