import * as fs from 'fs'
import * as path from 'path'
import {Playlist} from "./entities/playlist";
import {APP} from "./app";
import ytdl from 'ytdl-core'

export class Downloader {

    async getPlaylists (): Promise<Playlist[]> {
        APP.spotify.log('Loading playlists from file...');

        const data = fs.readFileSync(path.resolve('data/downloader.txt')).toString('utf8');
        const uris = data.split('\n');

        const playlists: Playlist[] = [];
        for (const uri of uris) {
            const playlist = await APP.spotify.getPlaylist(uri);
            await playlist.load();
            playlists.push(playlist)
        }

        APP.spotify.log(`${playlists.length} playlists has been loaded !`);
        return playlists;
    }

    async downloadPlaylist (playlist: Playlist): Promise<any> {
        fs.mkdirSync(`data/${playlist.data.name}`);
        APP.youtube.log(`Downloading tracks of playlist ${playlist.data.name}`);
        let done = 0;
        for (const track of playlist.tracks) {
            const url = await APP.youtube.getYoutubeUrlByTrack(track);
            await this.download(url, `data/${playlist.data.name}/${track.name}.mp4`);
            done++;
            APP.youtube.log(`Song ${track.data.name} succesfully downloaded (${done}/${playlist.tracks.length})`)
        }
    }

    download (url: string, path: string) {
        return new Promise((resolve, reject) => {
            ytdl(url, {quality: 'highestaudio', filter: "audioonly"}).pipe(fs.createWriteStream(path))
                .on('finish', () => {
                    resolve()
                })
        });
    }

}