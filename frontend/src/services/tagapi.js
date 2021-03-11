
const resError = (res) => {
    let msg = (res.statusText ? res.statusText : "Unspecified error") + " (" + res.status + ")"
    console.log(msg)
    return msg
}

const dataError = (data) => {
    let message = "Unknown error"
    if (data.errorMessage) {
        console.log(data.errorMessage)
        message = data.errorMessage
    }
    return message
}

export const loginUser = (username) => {
    return new Promise(function (resolve, reject) {
        let url = process.env.GATSBY_API_URL + "/session"
        let headers = {
            "Content-Type": "application/json"
        }
        fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({username: username})
        }).then((res) => {
            if (res.ok) {
                res.json().then((data) => {
                    console.log(data)
                    if (data.success) {
                        resolve(data.session.token)
                    } else {
                        reject(new Error(dataError(data)))
                    }
                })
            } else {
                reject(new Error(resError(res)))
            }
        }).catch((err) => {
            console.log(err)
            reject(err)
        })
    })
}

export const logoutUser = (authToken) => {
    return new Promise(function(resolve, reject) {
        let url = process.env.GATSBY_API_URL + "/session"
        let headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + authToken
        }
        fetch(url, {
            method: "DELETE",
            headers: headers
        }).then((res) => {
            if (res.ok) {
                res.json().then((data) => {
                    console.log(data)
                    if (data.success) {
                        resolve(true)
                    } else {
                        reject(new Error(dataError(data)))
                    }
                })
            } else {
                reject(new Error(resError(res)))
            }
        }).catch((err) => {
            console.log(err)
            reject(err)
        })
    })
}

export const postTag = (authToken, photoId, tagged) => {
    return new Promise(function (resolve, reject) {
        let url = process.env.GATSBY_API_URL + "/tag"
        let headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + authToken
        }
        fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({photoId: photoId, tag: tagged})
        }).then((res) => {
            if (res.ok) {
                res.json().then((data) => {
                    console.log(data)
                    if (data.success) {
                        resolve()
                    } else {
                        reject(new Error(dataError(data)))
                    }
                })
            } else {
                reject(new Error(resError(res)))
            }
        }).catch((err) => {
            console.log(err)
            reject(err)
        })
    })
}

export const getTags = (authToken) => {
    return new Promise(function (resolve, reject) {
        let url = process.env.GATSBY_API_URL + "/tags"
        let headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + authToken
        }
        fetch(url, {
            method: "GET",
            headers: headers
        }).then((res) => {
            if (res.ok) {
                res.json().then((data) => {
                    console.log(data)
                    if (data.success) {
                        resolve(data.tags)
                    } else {
                        reject(new Error(dataError(data)))
                    }
                })
            } else {
                reject(new Error(resError(res)))
            }
        }).catch((err) => {
            console.log(err)
            reject(err)
        })
    })
}

export const getPhotos = (authToken) => {
    return new Promise(function (resolve, reject) {
        let url = process.env.GATSBY_API_URL + "/photos"
        let headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + authToken
        }
        fetch(url, {
            method: "GET",
            headers: headers
        }).then((res) => {
            if (res.ok) {
                res.json().then((data) => {
                    console.log(data)
                    if (data.success) {
                        resolve(data.photos)
                    } else {
                        reject(new Error(dataError(data)))
                    }
                })
            } else {
                reject(new Error(resError(res)))
            }
        }).catch((err) => {
            console.log(err)
            reject(err)
        })
    })
}

