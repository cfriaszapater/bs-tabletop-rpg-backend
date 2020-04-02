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

### Acceptance tests

```sh
docker-compose up --build
```

See [acceptance-tests](./acceptance-tests/README.md).

### Smoke test

```sh
curl localhost:8080
```

### Set MONGODB_URI

You can put the URI in a file named `.dev-mongodb-uri` in the root of the project and it will be automatically picked up by the run script in dev env (see below).

The URI looks like this, substituting `<user>`, `<pass>` and `cluster0-pmxkl.azure.mongodb.net` with your own (*):

`mongodb+srv://<user>:<pass>@cluster0-pmxkl.azure.mongodb.net/bs-tabletop-rpg?retryWrites=true&w=majority`

(*) You can create a cloud mongodb account in the free tier and use it.

### Run

In dev:

```sh
DEBUG=bs-tabletop-rpg-backend:* npm run devstart | bunyan
```

Or:

```sh
npm start
```

#### Debug

```sh
npm run debug
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

### Build and run with docker (optional)

`docker-compose up --build` will do, but if you want to do it manually, eg:

```sh
docker build . -t bs-tabletop-rpg-backend:latest
docker run -d -p 8080:8080 --name bs-tabletop-rpg-backend bs-tabletop-rpg-backend
```

## License

See [LICENSE](./LICENSE).
