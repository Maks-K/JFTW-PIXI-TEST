import { Howl } from "howler";

export class SoundManager {
    sounds: { [key: string]: Howl };

    constructor() {
        this.sounds = {
            ambient: new Howl({ src: "assets/sounds/ambient.mp3", loop: true, volume: 0.5 }),
            win: new Howl({ src: "assets/sounds/and-his-name-is-john-cena.mp3" }),
            click: new Howl({ src: "assets/sounds/click.mp3" }),
            hover: new Howl({ src: "assets/sounds/hover.mp3" }),
            lost: new Howl({ src: "assets/sounds/oh-shit-im-sorry.mp3" }),
            spin: new Howl({ src: "assets/sounds/tick.mp3", loop: true }),
            bounce: new Howl({ src: "assets/sounds/bounce.mp3" }),
        };

        [this.sounds.win, this.sounds.lost].forEach((sound) => {
            sound.on("play", () => this.sounds.ambient.volume(0.1));
            sound.on("end", () => this.sounds.ambient.volume(0.5));
        });
    }

    playSound(soundName: string): void {
        this.sounds[soundName].play();
    }

    stop(soundName: string): void {
        this.sounds[soundName].stop();
    }
}
