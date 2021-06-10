import firebase from "./firebaseConfig"

export const db = firebase.database()

const newUser = (username, email, gender, height, weight, job) => ({
  gender: gender,
  job: job,
  height: height,
  weight: weight,
  username: username,
  email: email,
  statistics: {
    level: 1,
    exp: 0,
    hp: 100,
    atk: 10,
    def: 10,
    evd: 10,
    spd: 10
  },
  runningLogs: {
    numberOfRuns: 0,
    totalDistanceRan: 0,
  }
})

export const createUser = async ({ id, username, email, gender, height, weight, job }, onSuccess, onError) => {
  try {
    const user = db.ref("users/" + id)
    await user.set(newUser(username, email, gender, height, weight, job))
    return onSuccess(user)
  } catch (error) {
    return onError(error)
  }
}

export const addRun = async ({ userId, time, distance, pace, calories, date }, onSuccess, onError) => {
  try {
    const run = db.ref("users/" + userId + "/runningLogs")
    const count = (await run.child("numberOfRuns").get()).val() + 1
      await run.child("history/" + count).set({
        date: date,
        time: time,
        distance: distance,
        pace: pace,
        calories: calories
      })
    await run.update({
      numberOfRuns: (await run.child("numberOfRuns").get()).val() + 1,
      totalDistanceRan: (await run.child("totalDistanceRan").get()).val() + distance,
    })
    return onSuccess(run)
  } catch (error) {
    return onError(error)
  }
}

export const userDetails = (id) => {
  return db.ref("users/" + id)
}