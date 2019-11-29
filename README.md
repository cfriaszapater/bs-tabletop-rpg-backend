# bs-tabletop-rpg-backend

BS tabletop RPG backend REST API.

See the frontend application at [bs-tabletop-rpg](https://github.com/cfriaszapater/bs-tabletop-rpg).

## Development

If you want to run it locally:

### Build

```sh
npm install
```

### Test

```sh
npm test
```

### Set MONGODB_URI

You can put the URI in a file named `.dev-mongodb-uri` in the root of the project and it will be automatically picked up by the run script in dev env (see below).

The URI looks like this, substituting `<user>`, `<pass>` and `cluster0-pmxkl.azure.mongodb.net` with your own (*):

`mongodb+srv://<user>:<pass>@cluster0-pmxkl.azure.mongodb.net/bs-tabletop-rpg?retryWrites=true&w=majority`

(*) You can create a cloud mongodb account in the free tier and use it.

### Run

In dev (debug log and monitor file changes):

```sh
DEBUG=bs-tabletop-rpg-backend:* npm run devstart | bunyan
```

Or:

```sh
npm start
```

### Deploy to production

This is what I used to deploy to production (having an heroku account and git heroku remote set to point to it):

```sh
git push heroku master
heroku open
```

View logs:

```sh
heroku logs --tail
```

Config:

```sh
heroku config
```

## License

See [LICENSE](./LICENSE).
