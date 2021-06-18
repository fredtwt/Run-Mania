import firebase from "./firebaseConfig"

export const db = firebase.database()

const newUser = (username, email, gender, height, weight, job, avatar) => ({
  gender: gender,
  job: job,
  height: height,
  weight: weight,
  username: username,
  email: email,
  statistics: {
    level: 1,
		points: 0,
    exp: 0,
    hp: 100,
    atk: 10,
    magic: 10,
    def: 10,
    mr: 10
  },
  runningLogs: {
    numberOfRuns: 0,
    totalDistanceRan: 0,
  }
})

export const createUser = async ({ id, username, email, gender, height, weight, job, }, onSuccess, onError) => {
  try {
    const user = db.ref("users/" + id)
    await user.set(newUser(username, email, gender, height, weight, job))
    return onSuccess(user)
  } catch (error) {
    return onError(error)
  }
}

export const searchUser = async ({id}, onSuccess, onError) => {
	try {
		const user = db.ref("users/" + id)
		return onSuccess(user)
	} catch (error) {
		return onError(error)
	}
}

export const sendFriendRequest = async ({currentId, friendId}, onSuccess, onError) => {
	try {
		const friend = db.ref("users/" + friendId + "/friends/friend-" + currentId )
		const user = db.ref("users/" + currentId + "/friends/friend-" + friendId) 

		await friend.set({
			uid: currentId,
			friend: false
		})

		await user.set({
			uid: friendId,
			friend: "pending" 
		})
		return onSuccess(friend)
	} catch (error) {
		return onError(error)
	}
}

export const acceptFriendRequest = async ({currentId, friendId}, onSuccess, onError) => {
	try {
		const friend = db.ref("users/" + friendId + "/friends/friend-" + currentId)
		const user = db.ref("users/" + currentId + "/friends/friend-" + friendId) 

		await friend.update({
			friend: true 
		})

		await user.update({
			friend: true 
		})
		return onSuccess(friend)
	} catch (error) {
		return onError(error)
	}
}

export const rejectFriendRequest = async ({currentId, friendId}, onSuccess, onError) => {
	try {
		const friend = db.ref("users/" + friendId + "/friends/friend-" + currentId)
		const user = db.ref("users/" + currentId + "/friends/friend-" + friendId) 

		await friend.set(null)
		await user.set(null)

		return onSuccess(friend)
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
    const points = (await stats.child("points").get()).val()
    const level = (await stats.child("level").get()).val()
    const levelExp = level * 2 * 1000 // in meters
    const currentExp = (await stats.child("exp").get()).val() + distance

    if (currentExp >= levelExp) {
			var newLevel = currentExp % levelExp
			var newExp = currentExp - (newLevel * levelExp)
      await stats.update({
        level: level + newLevel,
        exp: newExp,
				points: points + 10, 
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

export const addStats = async ({userId, hp, atk, magic, def, mr, points}, onSuccess, onError) => {
	try {
		const stats = db.ref("users/" + userId + "/statistics")
		await stats.update({
			hp: hp,
			atk: atk,
			magic: magic,
			def: def,
			mr: mr,
			points: points
		})

		return onSuccess()
	} catch (error) {
		return onError(error)
	}
}

export const userDetails = (id) => {
  return db.ref("users/" + id)
}