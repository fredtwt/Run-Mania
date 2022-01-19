![Image alt text](./assets/logo.png)

# Run-Mania
A running app that generates a looping route for you based on the distance you set. 
Compete and challenge with your friends as you level up through running!
Visit https://run-mania.gitbook.io/run-mania/ for the full documentation!

## Installation
1. Install ExpoGo from App Store/Google Play (iOS users - take note of no background location tracking, see 'Tracking the run')
1. With ExpoGo installed, click on this link [here](https://exp.host/@rubbercoin/runmania-app/index.exp?sdkVersion=41.0.0) 

Alternatively, download and install the standalone APK [here](https://drive.google.com/file/d/1ipxg7uNAGBQUAwLQd4mb1Ii40OxmTahZ/view?usp=sharing).

If you encounter any bugs, please report them at https://forms.gle/C1UYr8NUu9wj23VAA.


## Scope of Project
A mobile application made using React Native that generates suitable looping routes of a specific distance you set for running and keeps track of your runs while having gamification features. Compete and challenge your friends as you level up through running! 

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
All users will be required to create an account to use our app. 
Our app requires:
- valid email address
- password (minimum 8 characters)
- username to easily identify the user's avatar
- user’s gender, height and weight (required to calculate calories burned). 

To make changes to their account information, they can do so in the settings page. 

### Leaderboard
This is where users can view the standings against other friends registered on this application. 

### Gamification
Earn experience by running! Required experience to level up is calculated by ( Current level * 2 ) kilometres. Level up to increase stats and get stronger in order to dominate your friends (and secure bragging rights!) in a real-time turn-based PvP combat.

### Settings
Allows users to edit their username, email or password. 

### Friends
Allows users to send friend requests with their unique ID code. Once they become friends on the app, they will be able to view the avatar and stats of others.

### PVP
Fight against your friends using your avatar in an interesting turn-based combat system!

## Development Plan
Currently implemented: 
- Account features
- Auto routing
- Running logs
- Leaderboard
- Friend list/requests
- Settings
- Avatar Stats screen
- PVP

To be completed by July:
- Improve project with suggestions from peer teams
- More improvements to PVP

## Tech Stack
- React Native with Javascript
- Expo, Expo Go
- Firebase
- Google Cloud: Google Directions

## System Design

### Data Flow
![image](https://user-images.githubusercontent.com/77159295/122953117-0e72aa80-d3b1-11eb-98d4-d1a952853f06.png)
![image](https://user-images.githubusercontent.com/77159295/123656725-c1844d80-d862-11eb-98da-60ff1278a6d3.png)

### Backend
This application uses Firebase as its backend. We chose Firebase as our backend as it has a simple UI with good documentation for us to learn from scratch. Firebase manages all data real-time in the database. So, the exchange of data to and fro from the database is easy and quick. Firebase also allows syncing the real-time data across all the devices- Android, iOS, and the web without refreshing the screen which suits our mobile-app features really well.
Some other benefits to why we use firebase:
- Create Application without backend server
- Sync real time data in the application
- Quick display data in the application
- No SQL database so it is much faster

### Frontend
This application uses React Native in conjunciton with Expo's managed workflow to allow our app to be easily published and run on both android and iOS platforms. 

### Login and Signup Page
![image](https://user-images.githubusercontent.com/77159295/123657713-9f3eff80-d863-11eb-866a-84ecd113359f.png) ![image](https://user-images.githubusercontent.com/77159295/123657799-b7af1a00-d863-11eb-9664-d83153577ffb.png)

The initial launch of our app will put users in the login page. From here they can register an account with our application. 
For registration, we require:
1) Valid email address
2) Username - the name of your avatar
3) Password - at least 8 characters
4) Height & Weight - weight is required to calculate calories burned
5) Gender - determines your avatar’s gender
6) Avatar’s job - choose between a Warrior, Mage or Archer

We are unable to use username to log in as Firebase does not have the option to use that as authentication. Therefore, we settled for account authentication via email address.

## Home Screens
The 4 Home Screens in our app are:
1. Avatar
2. Stats
3. Run
4. PVP

## Avatar
The first page users will see after logging in is the Avatar screen. They will be able to see their avatar’s information and a progress bar for the next level. Below this information, the user’s most recent run is shown. All the information shown here is fetched from Firebase.

![image](https://user-images.githubusercontent.com/77159295/123658568-6e12ff00-d864-11eb-87cc-0a7fac978935.png) ![image](https://user-images.githubusercontent.com/77159295/123658371-3f952400-d864-11eb-81b8-d9c672b1e247.png)

At the bottom navigation bar, the user can navigate and gain access to the other home screens, namely the avatar screen, adding stats screen, the running feature and the PVP feature respectively. 
We chose to put the navigation to these 4 screens here at the bottom as we felt it would be the most frequented compared to the other screens such as Settings or Running Logs. 

From any of these 4 home screens, the user can slide in from the left or hit the button at the top left to view a separate menu with more navigation options.

## Stats
![image](https://user-images.githubusercontent.com/77159295/123659117-ed083780-d864-11eb-99eb-3e2b09a1bd3f.png)

At the stats screen, users will be able to strengthen themselves using the stat points gained from levelling up. Each level will grant the user 10 stat points to strengthen their stats. 

HP: Hit Points
Avatar’s health. Lose the battle when HP reaches 0.     
Investing 1 stat point grants 10 HP.

ATK: Attack
Used to calculate damage dealt by a basic attack. 	   
Investing 1 stat point grants 2 ATK.

MAGIC: Magic Attack
Used to calculate damage dealt by a special attack.    
Investing 1 stat point grants 2 MAGIC.

DEF: Defence
Reduces damage taken from basic attacks.	 	   
Investing 1 stat point grants 2 DEF.

MR: Magic Resist
Reduces damage taken from special attacks. 	   
Investing 1 stat point grants 2 MR.

## PVP 
![image](https://user-images.githubusercontent.com/77159295/123661613-45403900-d867-11eb-8019-99e092f757c4.png) ![image](https://user-images.githubusercontent.com/77159295/123661197-f4c8db80-d866-11eb-9106-5c1dd527e307.png)

At the PVP page, users will be able to see other online users in the arena. Since it is real-time PVP, offline users will not be displayed here. Also, we made sure that the users shown in the arena are within a 3 level range from the current user to ensure the PVP isn’t too one sided. The current user would then be able to select which of the following users he/she would like to face off in a match. After clicking on the challenge button, a PVP request would be sent to the challenged user and he/she would have the option to accept/reject the match.

![image](https://user-images.githubusercontent.com/77159295/123661495-293c9780-d867-11eb-88b4-f1471b9eb2c3.png) ![image](https://user-images.githubusercontent.com/77159295/123661522-2fcb0f00-d867-11eb-847f-af6a77416ebb.png)

When the challenged user accepts the PVP request, both users would be redirected to the battle screen as shown above. The concept of this PVP style is as follows:
1. Every turn, users each have 4 options to select
   - ATK - Deals 100% of ATK
   -  SKILL - Uses job’s unique skill
   -  DEFEND - Negates 90% of the incoming damage
   - SURRENDER - Surrender and lose the game
2. Once both users have locked in their selected action for that turn, the turn ends and the actions are triggered
3. The battle dialog would display the sequence of events that occurred in that turn
4. This would repeat until one of the user surrenders or his/her hp falls to 0

**_Skills damage scales with MAGIC and the damage is reduced by MR_**
**_Attack damage scales with ATK and the damage is reduced by DEF_**

| Job | Skill Name | Effect |  Cooldown |
|-----------|----------|------------|:-----------| 
| Warrior | Double-edged | Next hit ignores 100% of target’s MR but reduces user’s DEF by 20% for 1 turn | 2 turns |  
| Mage | Siphon Life | Heal for 50% of the damage dealt but reduces user’s ATK by 20% for 1 turn | 3 turns |
| Archer | Twin Shot | Next attack strikes twice, dealing 200% damage but user forfeits the next turn | 3 turns |

## Run
![image](https://user-images.githubusercontent.com/77159295/123664394-e3350300-d869-11eb-954a-bd4425767099.png)

This is where the pathfinding algorithm is used. Users will be able to define the distance they feel like running with the slider. We have limited the slider to a range of 1km to 20km, with increments of 0.5km. With the distance set, the user can hit the Generate Route button and have the app produce a route. If the user is unsatisfied with the route given, they can repeatedly generate another route until satisfied. 
With the route satisfied, the user can begin their run by tapping on the Start Run button and the generated route (purple line) will still be kept on the next page. As the user runs, a blue line is drawn on the map to show the route the user has run so far. 

![image](https://user-images.githubusercontent.com/77159295/123664735-3313ca00-d86a-11eb-9147-06becd0608b8.png)

## Friends & Friend Requests
![image](https://user-images.githubusercontent.com/77159295/123665157-956cca80-d86a-11eb-8350-bc0874871e67.png) ![image](https://user-images.githubusercontent.com/77159295/123665016-79692900-d86a-11eb-8c38-b4a949f21059.png) ![image](https://user-images.githubusercontent.com/77159295/123664929-63f3ff00-d86a-11eb-9c74-f5a21ebc16d6.png)

From the Friends screen, users can view and copy their own unique identification (UID) to share with their friends. Users will also be able to send friend requests from here by searching up the UIDs from their friends. A pop out will show the avatar and stats of the friend to be added. After accepting the friend request, users will be able to see their friends in the Friends screen. Tapping on a friend would bring up a similar card as shown in the first picture, with the new option to unfriend. 

## Leaderboard 
![image](https://user-images.githubusercontent.com/77159295/123665321-c2b97880-d86a-11eb-8a52-9558874b7dcd.png)

The leaderboard we implemented is a global leaderboard, comparing yourself with all other users registered in our application. 

For now, we are going ahead with a global leaderboard. We have plans to implement a way to filter out friends only and also a separate leaderboard for our PVP feature. 

## Running Logs
![image](https://user-images.githubusercontent.com/77159295/123665405-d5cc4880-d86a-11eb-917b-ddaa4e7a4249.png) ![image](https://user-images.githubusercontent.com/77159295/123665584-fc8a7f00-d86a-11eb-98d9-ea438c7f5e84.png)

In the Running Logs page, users will be able to view up to 100 of their most recent runs. 
The details of each run can be easily seen on its respective card. By tapping on them, a map overlay with the route drawn will be shown to the user. The map is not a static image, but can be interacted with actions such as zooming in or out and panning around. The information here is all queried from Firebase.

## Software Development Process
### Auto routing
------
To achieve the auto routing, we first use Expo's location module to retrieve the user's current location as the point of origin, then another module from npmjs library which allows us to pick a random point on a circle from a set radius (using the same distance defined by the user). We use this module to find 2 points, and together with the origin as the starting and ending point, we are able to request a route from Google Directions API to generate the route for us. 

Thus the request to Google will look like this: [Origin, Random Pt 1, Random Pt 2, Origin].

Why only 2 random points? 

With only 2 random points, the route generated on a 2D map will result in a proper loop, whereas with 3 or more random points, the route generated may not give us a loop (as illustrated below).

![image](https://user-images.githubusercontent.com/77159295/123443823-d4034a80-d608-11eb-94b2-e0e5bdbb90f2.png)

The distance of the generated route will never exactly be the distance desired by the user. 
Therefore, we recursively do the following to get a route: 
1. Check the distance of the route (using another module)
2. If it is within 250m of the desired distance, we show the user the route
3. Otherwise, we request from Google Directions API again for another route
Once the user is satisfied with the route shown, they may start the run with the generated route displayed on their device and begin running the route.

A limitation to this algorithm is that we can only rely on the data Google collects for its Directions API, therefore the route would most likely be along roads. Footpaths or running tracks may not appear in our algorithm due to this.


### Tracking the run
------
When the run starts and at every position change, the app records down the user's new location and appends the information into the back of an array. This array stores elements containing the latitude and longitude values of the user during their run, thus allowing us to dynamically plot a line on the map as the user moves. A timer is implemented by simply incrementing a variable by 1 at every 1s intervals. The tricky part to implement is when the app is backgrounded but we still want it to continue tracking. 

When the app is backgrounded, we want to track only 2 things, the timer and location. 
1. For the timer, a timestamp is recorded the moment the app goes into the "background" and into the "active" state respectively. By taking the time between these 2 timestamps, we will then have the duration the device spent in the background. All that is left is to add this duration to the timer variable once the app returns to the “active” state.

2. For the location, we will have to request for both foreground and background location services permissions on the user's phone. With the background location services granted, the application will be able to constantly update the locations array and hence continue tracking the user. Once the app state changes back into "active", the background tracking stops while the foreground tracking resumes. 

#### **However, background location tracking DOES NOT work on physical iOS devices unless we build the application, which requires an Apple Developer Account**
This is a limitation by the Expo Client for iOS devices specifically (see [here](https://forums.expo.io/t/background-location-not-working/23433/3)).
We have tested the background location tracking to be working on iOS simulator, Android Studio and a phyiscal android device. 

**Therefore, if you want to test on a physical iOS device, you have to leave it unlocked.**

![image](https://user-images.githubusercontent.com/77159295/123666183-905c4b00-d86b-11eb-9160-1a54225b38a3.png)

When the user ends the run, they will be able to see their progress to the next level, time taken, average pace, distance travelled, estimated calories burned and an interactive map for them to view their finished run. 
This information will be logged into our database, thus allowing users to look at their running history. 



### Firebase Usage
------
We use Firebase to keep track of all the data such as the user's stats, past runs (statistics + array of user locations), which user is friends with who, and to implement the leaderboard and PVP functions. One of the main reasons for choosing firebase would be its simplicity and user-friendly UI. The query methods are also really suitable for our mobile app implementation.

For the leaderboard and running logs, firebase helps to maintain all of our users’ run records. For both features, we made use of queries to firebase to retrieve the necessary data for the UI.

As for the friends feature, when a user searches for another user through the UID, it sends a firebase query to help retrieve that specific user’s information.

Last but not least the PVP feature. We made use of a lot of firebase queries to help handle the PVP logic and the real-time aspect of the battle. The main method used here to listen for changes would be the on() method from firebase. This method helped us to maintain the real-time aspect of our PVP feature by listening to changes and updating the UI accordingly. 
