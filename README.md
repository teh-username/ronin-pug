Codebase for [laroberto.com](https://laroberto.com)

### Up and Running

There are two ways of setting up the dev environment.

Normal way (assumes you have `node` and `yarn` installed):

```bash
git clone https://github.com/teh-username/ronin-pug.git ronin-pug
cd ronin-pug
yarn install --pure-lockfile
node_modules/nodemon/bin/nodemon.js
```

Docker way (assumes you have `docker` && `docker-compose` installed):
```bash
git clone https://github.com/teh-username/ronin-pug.git ronin-pug
cd ronin-pug
docker-compose -f docker-compose.dev.yml up
```

You can now access the website via `localhost:8080`.
