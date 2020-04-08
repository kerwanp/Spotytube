import {Downloader} from "./downloader";
import axios, {AxiosInstance} from "axios";
import {Spotify} from "./spotify";
import {Youtube} from "./youtube";
import dotenv from 'dotenv'

export class App {

    httpClient: AxiosInstance;
    spotify: Spotify;
    youtube: Youtube;
    downloader: Downloader;

    constructor() {
        dotenv.config();

        this.httpClient = axios.create();
        this.spotify = new Spotify(process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_CLIENT_SECRET, 'http://localhost:8000/callback');
        this.youtube = new Youtube();
        this.downloader = new Downloader();
    }

    async init() {
        await this.start();
        const playlists = await this.downloader.getPlaylists();
        await this.downloader.downloadPlaylist(playlists[0])
    }

    async start() {
        await this.spotify.authenticate()
    }

}

export const APP = new App();
APP.init().catch(err => console.log(err));