> Node.JS project which using the onion architecture

## Project setup

```
npm install &&
npm run build &&
(PGPASSWORD=postgres createdb -h localhost -U local -E utf8 -O local onion_local) &&
npm run migrate:up
```
