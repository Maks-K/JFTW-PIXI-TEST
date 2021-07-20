import * as PIXI from "pixi.js";
import gsap from "gsap";
import { config } from "../config/config";
import { getTexture } from "./utils";

export class PresentationSplash extends PIXI.Sprite {
    constructor(parent: PIXI.Container) {
        super();
        this.anchor.set(0.5);
        this.alpha = 0;
        parent.addChild(this);
    }

    playLose(): gsap.core.Tween {
        const loseConfig = config.presentationSplash.lose;
        this.texture = getTexture(loseConfig.image);
        this.position.set(loseConfig.x, loseConfig.y);
        return this.playPresentation();
    }

    playWin(): gsap.core.Tween {
        const winConfig = config.presentationSplash.win;
        this.texture = getTexture(winConfig.image);
        this.position.set(winConfig.x, winConfig.y);
        return this.playPresentation();
    }

    playPresentation(): gsap.core.Tween {
        return gsap.to(this, { alpha: 1, duration: 1, repeat: 1, yoyo: true, repeatDelay: 2 });
    }
}
