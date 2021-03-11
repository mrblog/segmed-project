REST Endpoints
--------------

### Set username

<a name="post-session"></a>
<kbd>POST</kbd> `/session`

    Accepts JSON object in POST body (Content-type: application/json)
      username: the username to associate with this user / session

    Returns a new token to be used in subsequent requests requiring auth

##### Sample Success Response

```json
{
 "session": {
   "token": "ccf85028-6fe0-405e-8d2f-3e3de9e47f33"
 },
 "success": true
}
```

##### Sample Error Response

```json
{
  "errorMessage": "login failed",
  "success": false
}
```

### Get Photos

<a name="get-photos"></a>
<kbd>GET</kbd> `/photos`

##### Authorization
    authentication required

    * Requires authentication (Bearer active token).


##### Sample Success HTTP Response

```json
{
    "photos": [
        {
            "id": "4_hFxTsmaO4",
            "title": "Orange bubbles art",
            "url": "http://static.bdt.com/segmed/photos/sharon-pittaway-4_hFxTsmaO4-unsplash.jpg"
        },
        {
            "id": "Lw7BruqPnJY",
            "title": "Blue splash",
            "url": "http://static.bdt.com/segmed/photos/joel-filipe-Lw7BruqPnJY-unsplash.jpg"
        },
        {
            "id": "gKUC4TMhOiY",
            "title": "Microscope on top of table",
            "url": "http://static.bdt.com/segmed/photos/ousa-chea-gKUC4TMhOiY-unsplash.jpg"
        }
    ],
    "success": true
}
```

### Get Tags

<a name="get-tags"></a>
<kbd>GET</kbd> `/tags`

##### Authorization
    authentication required

    * Requires authentication (Bearer active token).


##### Sample Success HTTP Response

```json
{
    "success": true,
    "tags": [
        {
            "photoId": "L9EV3OogLh0",
            "tag": true
        },
        {
            "photoId": "Lw7BruqPnJY",
            "tag": true
        }
    ]
}
```

### Tag a Photo

<a name="post-tag"></a>
<kbd>POST</kbd> `/tag`

##### Authorization
    authentication required

    * Requires authentication (Bearer active token).

    Accepts JSON object in POST body (Content-type: application/json)
      photoId: the the photo to tag
      tag: true/false to tag or un-tag photo

##### Sample Success HTTP Response

```json
{
    "success": true
}
```

### End session

<a name="post-session"></a>
<kbd>DELETE</kbd> `/session`

     authentication required

    * Requires authentication (Bearer active token).

##### Sample Success Response

```json
{
 "success": true
}
```
