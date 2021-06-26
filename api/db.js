import firebase from "./firebaseConfig"

export const db = firebase.database()

const newUser = (username, email, gender, height, weight, job, avatar) => ({
	status: false,
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

export const login = async (id) => {
	const user = db.ref("users/" + id)
	user.update({
		status: true
	})
}

export const logout = async (id) => {
	const user = db.ref("users/" + id)
	user.update({
		status: false 
	})
}

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

export const newGame = async ({ id, player, opponent }, onSuccess, onError) => {
	try {
		const game = db.ref("pvp/" + id ) 
		const p1 = db.ref("pvp/" + id + "/" + player)
		const p2 = db.ref("pvp/" + id + "/" + opponent)
		const player1 = db.ref("users/" + player + "/currentMatch")
		const player2 = db.ref("users/" + opponent + "/currentMatch")
		var p1Username = ""
		var p2Username = ""
		var p1Stats, p2Stats, p1Job, p2Job, p1Gender, p2Gender

		await db.ref("users/" + player).get().then(user => {
			p1Username = user.val().username
			p1Stats = user.val().statistics
			p1Job = user.val().job
			p1Gender= user.val().gender
		})

		await db.ref("users/" + opponent).get().then(user => {
			p2Username = user.val().username
			p2Stats = user.val().statistics
			p2Job = user.val().job
			p2Gender= user.val().gender
		})
		
		await game.set({
			id: id,
			gameStarted: false,
		})

		await p1.set({
			action: "",
			ready: false,
			username: p1Username,
			stats: p1Stats,
			job: p1Job,
			gender: p1Gender	
		})

		await p2.set({
			action: "",
			ready: false,
			username: p2Username,
			stats: p2Stats,
			job: p2Job,
			gender: p2Gender	
		})

		await player1.set({
			gameStarted: false,
			player1: player,
			player2: opponent,
			p1Username: p1Username,
			p1Stats: p1Stats,
			p1Job: p1Job,
			p1Gender: p1Gender,
			player2: opponent,
			p2Username: p2Username,
			p2Stats: p2Stats,
			p2Job: p2Job,
			p2Gender: p2Gender,
			id: id,
			position: "inviter",
		})

		await player2.set({
			gameStarted: false,
			player1: player,
			player2: opponent,
			p1Username: p1Username,
			p1Stats: p1Stats,
			p1Job: p1Job,
			p1Gender: p1Gender,
			p1Ready: false,
			p1Action: "",
			player2: opponent,
			p2Username: p2Username,
			p2Stats: p2Stats,
			p2Job: p2Job,
			p2Gender: p2Gender,
			p2Ready: false,
			p2Action: "",
			id: id,
			position: "recipient",
		})

		return onSuccess(game)
	} catch (error) {
		return onError(error)
	}
}

export const acceptGame = async ({ id, player, opponent }, onSuccess, onError) => {
	try {
		const game = db.ref("pvp/" + id ) 
		const player1 = db.ref("users/" + player + "/currentMatch")
		const player2 = db.ref("users/" + opponent + "/currentMatch")
		
		await game.update({
			gameStarted: true
		})
		await player1.update({
			gameStarted: true
		})
		await player2.update({
			gameStarted: true
		})
		return onSuccess(game)
	} catch (error) {
		return onError(error)
	}
}

export const cancelGame = async ({ id, player, opponent }, onSuccess, onError) => {
	try {
		const game = db.ref("pvp/" + id ) 
		const player1 = db.ref("users/" + player + "/currentMatch")
		const player2 = db.ref("users/" + opponent + "/currentMatch")
		
		await game.set(null)
		await player1.set(null)
		await player2.set(null)

		return onSuccess(game)
	} catch (error) {
		return onError(error)
	}
}

export const updateGameState = async (playerId, action, matchId) => {
	const game = db.ref("pvp/" + matchId + "/" + playerId)

	await game.update({
		action: action,
		ready: true,
	})
}

export const userDetails = (id) => {
  return db.ref("users/" + id)
}

export const game = (id) => {
  return db.ref("pvp/" + id)
}

export const gameDetails = (username) => {
  return db.ref("users/" + username + "/currentMatch")
}