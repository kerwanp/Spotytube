import {Track} from "./track";
import {APP} from "../app";

export class Playlist {

    id: string;
    tracks: Track[] = [];

    data: SpotifyApi.SinglePlaylistResponse;

    constructor(data: SpotifyApi.SinglePlaylistResponse) {
        this.id = data.id;
        this.data = data
    }

    async load () {
        this.tracks = await APP.spotify.getTracksByPlaylist(this);
        APP.spotify.log(`Playlist "${this.data.name}" successfully loaded !`);
    }

}