# Spotytube - Spotify downloader

Spotytube is a NodeJS program to easily download every song of a Spotify playlist with only one URL.

## WIP

This project is still under development.
You may occurs issues while using it.

## Dependencies
* NodeJS
* NPM
* A Spotify Application (https://developer.spotify.com/dashboard/applications)

## Usage

First, clone the project:
```shell script
git clone git@github.com:kerwanp/Spotytube.git && cd Spotytube
```

Then install dependencies:
```shell script
npm install
```

Open the file `src/.env` and enter the credentials of your Spotify application.

Open the file `data/downloader.txt` and append the URLs of your playlists (one by line).

Run the application:
```shell script
npm run webpack
```

Spotify will ask you to login and authorize your application to interact with your account, just follow the instructions.

Then go back to your terminal and wait for your songs to be downloaded.

You will be able to find them in the directory `data/<your-playlist-name>`
