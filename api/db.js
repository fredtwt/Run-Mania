import firebase from "./firebaseConfig"

export const db = firebase.database()

const newUser = (username, email) => ({
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

export const createUser = async ({ id, username, email }, onSuccess, onError) => {
  try {
    const user = db.ref("users/" + id)
    await user.set(newUser(username, email))
    return onSuccess(user)
  } catch (error) {
    return onError(error)
  }
}

export const userDetails = (id) => {
  return db.ref("users/" + id)
}