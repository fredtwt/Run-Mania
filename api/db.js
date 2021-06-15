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

export const addRun = async ({ userId, time, distance, pace, calories, date, route, origin}, onSuccess, onError) => {
  try {
    const run = db.ref("users/" + userId + "/runningLogs")
    const count = (await run.child("numberOfRuns").get()).val() + 1
      await run.child("history/" + count).set({
				key: count,
        date: date,
        time: time,
        distance: distance,
        pace: pace,
        calories: calories,
				route: route,
				origin: origin
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
export const addExperience = async ({userId, distance}, onSuccess, onError) => {
  try {
    const stats = db.ref("users/" + userId + "/statistics")
    const atk = (await stats.child("atk").get()).val()
    const def = (await stats.child("def").get()).val()
    const evd = (await stats.child("evd").get()).val()
    const hp = (await stats.child("hp").get()).val()
    const spd = (await stats.child("spd").get()).val()
    const level = (await stats.child("level").get()).val()
    const levelExp = level * 2 * 1000 // in meters
    const currentExp = (await stats.child("exp").get()).val() + distance

    if (currentExp >= levelExp) {
			var newLevel = currentExp % levelExp
			var newExp = currentExp - (newLevel * levelExp)
      await stats.update({
        level: level + newLevel,
        exp: newExp,
        atk: atk + 10,
        def: def + 10,
        evd: evd + 10,
        spd: spd + 10,
        hp: hp + 10 
      })
      return onSuccess(levelExp, currentExp - levelExp)
    } else {
      await stats.update({
        exp: currentExp
      })
      return onSuccess(levelExp, currentExp)
    }
  } catch (error) {
    return onError(error)
  }
}

export const userDetails = (id) => {
  return db.ref("users/" + id)
}