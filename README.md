# Fincounter API

#### To run the app without cloning the source code, just execute the `docker-compose.yml` with command:
```
docker compose up -d fincounter-api
```
#### If you decide to clone the source code, you can still use the approach described above to run the app, but now you have more convenient options:
- to run local production setup:
```
npm run build
```
```
npm run start
```
- to run production setup (equivalent to `docker compose up -d fincounter-api`):
```
npm run prod
```
- to run development setup:
```
npm run dev
```
#### The API will be available at `http://localhost:2023`.
#### The documentation will be at `http://localhost:2023/api-docs`.
