import ytsr from 'ytsr'
import {Track} from "./entities/track";
import colors from "colors";

export class Youtube {

    getYoutubeUrlByTrack(track: Track): Promise<string> {
        const searchQuery = `${track.name} - ${track.data.artists[0].name}`;

        return new Promise((resolve, reject) => {
            ytsr(searchQuery, {limit: 1}, (err, results) => {
                if (err) reject(err);
                resolve(results.items[0].link)
            })
        })
    }

    log (message: string) {
        console.log(`${colors.red('[YOUTUBE]')} ${message}`)
    }

}