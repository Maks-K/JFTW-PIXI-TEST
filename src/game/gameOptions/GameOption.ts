import gsap from "gsap";
import { Button } from "../button";
import { LayoutConfig } from "../../config/config";
import { SoundManager } from "../SoundManager";

export class GameOption extends Button {
    isSelected = false;
    originalY: number;

    constructor(
        textureName: string,
        onSelected: () => void,
        public onDeselected: () => void,
        layout: LayoutConfig,
        soundManager: SoundManager
    ) {
        super(textureName, onSelected, layout, soundManager);

        // game option is shifted on selection, therefore original position storing is required
        this.originalY = layout.y;
    }

    //<editor-fold desc="INTERACTION">
    onButtonUp(): void {
        if (this.isDown) {
            this.isSelected ? this.deselect() : this.select();
        }

        this.isDown = false;
        this.scale.set(this.originalScale);
    }

    select(): void {
        this.isSelected = true;
        // shifting button to make is stand out from "non-selected" list
        this.y = this.originalY + 10;
        this.onClick();
    }

    deselect(): void {
        this.isSelected = false;
        // returnting button back to "non-selected" list:
        this.y = this.originalY;
        this.onDeselected();
    }
    //</editor-fold>

    //<editor-fold desc="ANIMATIONS">
    async playWin(): Promise<void> {
        // removing disabled look of the button:
        this.tint = 0xffffff;
        // and putting it on top of the rest:
        this.parent.addChildAt(this, this.parent.children.length - 1);

        await gsap.to(this.scale, { x: this.originalScale * 1.5, y: this.originalScale * 1.5, duration: 0.2 });
        await gsap.to(this, { rotation: 1, duration: 0.5, repeat: 1, yoyo: true });
        await gsap.to(this, { rotation: -1, duration: 0.5, repeat: 1, yoyo: true });
        await gsap.to(this.scale, { x: this.originalScale, y: this.originalScale, duration: 0.2 });
    }

    /**
     * Gradual returning to initial state (on game round end);
     */
    async reset(): Promise<void> {
        await gsap.to(this, { y: this.originalY, duration: 1 });
        this.deselect();
    }
    //</editor-fold>
}
