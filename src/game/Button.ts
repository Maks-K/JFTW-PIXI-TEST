import * as PIXI from "pixi.js";
import { getTexture } from "./utils";
import { LayoutConfig } from "../config/config";
import { SoundManager } from "./SoundManager";

export class Button extends PIXI.Sprite {
    originalScale!: number;
    onClick: () => void;
    isDown = false;
    isOver = false;

    constructor(textureName: string, onClick: () => void, layout: LayoutConfig, public soundManager: SoundManager) {
        super(getTexture(textureName));
        this.onClick = onClick;

        this.init(layout);
    }

    init(layout: LayoutConfig): void {
        this.position.set(layout.x, layout.y);

        if (layout.size) {
            this.width = layout.size.width;
            this.height = layout.size.height;
        }

        this.originalScale = this.scale.x;

        this.anchor.set(0.5);
        this.interactive = true;
        this.buttonMode = true;

        this.setupInteraction();
    }

    disable(): void {
        this.interactive = false;
        // adding grey-ish color to button's disabled state
        this.tint = 0x808080;
    }

    enable(): void {
        this.interactive = true;
        // resetting default tint:
        this.tint = 0xffffff;
    }

    //<editor-fold desc="INTERACTION">
    setupInteraction(): void {
        this.on("pointerdown", this.onButtonDown);
        this.on("pointerup", this.onButtonUp);
        this.on("pointerupoutside", this.onButtonUpOutSide);
        this.on("pointerover", this.onButtonOver);
        this.on("pointerout", this.onButtonOut);
    }

    onButtonDown(): void {
        this.isDown = true;
        this.scale.set(this.originalScale * 0.98);
        this.soundManager.playSound("click");
    }

    onButtonUp(): void {
        if (this.isDown) {
            this.onClick();
        }

        this.isDown = false;
        this.scale.set(this.originalScale);
    }

    onButtonUpOutSide(): void {
        this.isDown = false;
        this.scale.set(this.originalScale);
    }

    onButtonOver(): void {
        this.isOver = true;
        if (this.isDown) {
            return;
        }
        this.scale.set(this.originalScale * 1.02);
        this.soundManager.playSound("hover");
    }

    onButtonOut(): void {
        this.isOver = false;
        if (this.isDown) {
            return;
        }
        this.scale.set(this.originalScale);
    }
    //</editor-fold>
}
