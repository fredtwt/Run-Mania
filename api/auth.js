import firebase from "./firebaseConfig"

const auth = firebase.auth()

export const signIn = async ({ email, password }, onSuccess, onError) => {
  try {
    const { user } = await auth.signInWithEmailAndPassword(email, password)
    return onSuccess(user)
  } catch (error) {
    return onError(error)
  }
}

export const createAccount = async ({ username, email, password }, onSuccess, onError) => {
  try {
    const { user } = await auth.createUserWithEmailAndPassword(email, password)
    if (user) {
      await user.updateProfile({ displayName: username })
      await user.sendEmailVerification()
      return onSuccess(user)
    }
  } catch (error) {
    return onError(error)
  }
}

export const signOut = async (onSuccess, onError) => {
  try {
    await auth.signOut()
    return onSuccess()
  } catch (error) {
    return onError(error)
  }
}

export const getCurrentUserId = () => auth.currentUser ? auth.currentUser.uid : null

export const getCurrentUsername = () => auth.currentUser ? auth.currentUser.displayName : null

export const getCurrentUserEmail = () => auth.currentUser ? auth.currentUser.email : null

export const setOnAuthStateChanged = (onUserAuthenicated, onUserNotFound) => auth.onAuthStateChanged((user) => {
  if (user) {
    return onUserAuthenicated(user)
  } else {
    return onUserNotFound(user)
  }
})
