const api = require("./tagapi")

export const isBrowser = () => typeof window !== "undefined"

export const getAuthToken= () =>
    isBrowser() && window.localStorage.getItem("authToken")
        ? JSON.parse(window.localStorage.getItem("authToken"))
        : null

export const setAuthToken = token =>
    window.localStorage.setItem("authToken", JSON.stringify(token))

export const getAuthUser= () =>
    isBrowser() && window.localStorage.getItem("authUser")
        ? JSON.parse(window.localStorage.getItem("authUser"))
        : {}

export const setAuthUser = user => {
    window.localStorage.setItem("authUser", JSON.stringify(user))
    return user
}

export const handleLogin = (username) => {
    return new Promise(function(resolve, reject) {
        api.loginUser(username).then((token) => {
            setAuthToken(token)
            console.log("handleLogin: token: " + token)
            const user = {username: username}
            setAuthUser(user)
            resolve(user)
        }).catch((err) => {
            console.log(err)
            reject(err)
        })
    })
}

export const isLoggedIn = () => {
    const token = getAuthToken()
    const user = getAuthUser();
    return !!token && !!user
}

export const logout = callback => {
    const token = getAuthToken()
    if (token) {
        // eslint-disable-next-line no-unused-vars
        api.logoutUser(token).then((success) => {
            // ignore results, we don't care
        }).catch((err) => {
            // again, we log error but we don't care if the API fails
            console.log(err)
        })
    }
    window.localStorage.removeItem("authUser")
    window.localStorage.removeItem("authToken")
    callback()
}