import SpotifyWebApi from "spotify-web-api-node";
import opn from 'opn'
import http from 'http'
import {Playlist} from "./entities/playlist";
import {Track} from "./entities/track";
import colors from 'colors'
import {response} from "express";

export class Spotify {

    api: SpotifyWebApi;


    constructor(private clientId: string, private clientSecret: string, private redirectUri: string) {
        this.api = new SpotifyWebApi({
            clientId, clientSecret, redirectUri
        })
    }

    authenticate (): Promise<any> {
        return new Promise((resolve, reject) => {
            const scopes = ['playlist-read-private'];
            const url = this.api.createAuthorizeURL(scopes, '');

            const server = http.createServer(async (req, res) => {
                try {
                    if (req.url.indexOf('/callback') > -1) {
                        const qs = new URL(req.url, 'http://localhost:8000')
                            .searchParams;
                        res.end('Authentication successfull ! Please return to the console.');

                        server.close();
                        const tokens = await this.api.authorizationCodeGrant(qs.get('code'));
                        this.api.setAccessToken(tokens.body['access_token']);
                        this.api.setRefreshToken(tokens.body['refresh_token']);
                        resolve(true)
                    }
                } catch (e) {
                    reject(e)
                }
            }).listen(8000, () => {
                console.log('You must authenticate to spotify in your browser.');
                opn(url)
            })

        });
    }

    async getPlaylist (uri: string): Promise<Playlist> {
        const url = new URL(uri);
        const response = await this.api.getPlaylist(url.pathname.split('/')[2]).then(res => res.body);
        return new Playlist(response)
    }

    async getTracksByPlaylist (playlist: Playlist): Promise<Track[]> {
        const items = [];
        let response = null;

        while (!response || !!response.next) {
            response = await this.api.getPlaylistTracks(playlist.id, !!response ? {offset: response.limit + response.offset} : {}).then(data => data.body);
            for (let item of response.items) {
                const track = new Track(item);
                await track.load();
                this.log(`Loading song informations (${items.length + 1}/${response.items.length})`);
                items.push(new Track(item))
            }
        }

        return items;
    }

    async getTrackArtists (track: Track) {
        const artists = [];
        for (const {id} of track.data.artists) {
            const artist = await this.api.getArtist(id).then(res => res.body);
            artists.push(artist);
        }
        return artists;
    }

    log (message: string) {
        console.log(`${colors.green('[SPOTIFY]')} ${message}`)
    }

}