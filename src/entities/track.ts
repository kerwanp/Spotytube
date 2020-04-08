import {APP} from "../app";

export class Track {

    name: string;
    artists: SpotifyApi.SingleArtistResponse[];
    data: SpotifyApi.SingleTrackResponse;

    constructor(data: SpotifyApi.PlaylistTrackObject) {
        this.data = data.track;
        this.name = data.track.name;
    }

    async load () {
        this.artists = await APP.spotify.getTrackArtists(this);
    }

}