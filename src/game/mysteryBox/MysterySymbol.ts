/*interface config {
    slotDimensions: {
        width: number,
        height: number
    },
    initialVerticalOffset: number;
    scale: number;
}*/

import * as PIXI from "pixi.js";
import gsap from "gsap";
import { config } from "../../config/config";
import { getTexture } from "../utils";

export class MysterySymbol extends PIXI.Sprite {
    DEFAULT_SYMBOL: string = config.mysteryBox.outcome;
    slotLength: number;
    supportedSymbols: string[];
    currentSymbol: string = this.DEFAULT_SYMBOL;

    constructor(initialVerticalOffset: number) {
        super();

        this.slotLength = config.mysteryBox.layout.size.height;
        this.supportedSymbols = config.gameOptions.images;
        this.y = initialVerticalOffset;

        this.setSymbol("mystery");

        this.anchor.set(0.5);
    }

    /**
     * Moving the symbol to the very beginning of the reel (from the very end) and sets the required symbol (
     * if needed, random symbol otherwise)
     *
     * @param {string} [symToSet] - symbol to set
     */
    resetToStart(symToSet?: string): void {
        //setting the symbol above the visible one
        this.y = -this.slotLength;

        if (symToSet) {
            this.setSymbol(symToSet);
        } else {
            this.setRandomSymbol();
        }
    }

    /**
     * Chooses random symbol from available ones and applies to current symbol
     */
    setRandomSymbol(): void {
        const randomSymIndex = Math.floor(Math.random() * this.supportedSymbols.length);
        const randomSymbol = this.supportedSymbols[randomSymIndex];

        this.setSymbol(randomSymbol);
    }

    setSymbol(name: string): void {
        this.texture = getTexture(name);
        this.currentSymbol = name;

        // the "?" symbol has no frame and gets distorted when applying dimensions to it:
        if (name === "mystery") {
            this.scale.set(1);
        } else {
            this.width = config.mysteryBox.layout.size.width;
            this.height = this.slotLength;
        }
    }

    async startBounce(): Promise<void> {
        await gsap.to(this, {
            y: "-=50",
            duration: 0.5,
            repeat: 1,
            yoyo: true,
        });
    }

    async moveOneSlot(): Promise<void> {
        await gsap.to(this, {
            y: this.y + this.slotLength,
            duration: config.mysteryBox.animation.timeToMoveOneSlot,
            ease: "none",
        });
    }

    async endBounce(): Promise<void> {
        await gsap.to(this, {
            y: `+=${config.mysteryBox.animation.endBounce.distance}`,
            duration: config.mysteryBox.animation.endBounce.duration,
            repeat: 1,
            yoyo: true,
        });
    }

    async reset(): Promise<void> {
        await gsap.to(this, { alpha: 0, duration: 0.5 });
        this.setSymbol("mystery");
        await gsap.to(this, { alpha: 1, duration: 0.5 });
    }
}
