# /.well-known/

TODO: Add `apple-app-site-association` here once the real iOS App ID and team
prefix are known. The file must be served with `Content-Type: application/json`
and without a `.json` extension. Do NOT commit placeholder app IDs.

Example shape (do not deploy with these values):

    {
      "applinks": {
        "apps": [],
        "details": [
          {
            "appID": "TEAMID.com.example.ciaorelated",
            "paths": ["/join/*", "/join"]
          }
        ]
      }
    }