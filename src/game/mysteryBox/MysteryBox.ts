import * as PIXI from "pixi.js";
import { getTexture } from "../utils";
import { config } from "../../config/config";
import { MysterySymbol } from "./MysterySymbol";
import { SoundManager } from "../SoundManager";

export class MysteryBox extends PIXI.Container {
    symbolsContainer: PIXI.Container;
    symbols: MysterySymbol[];

    constructor(
        bgTextureName: string,
        outcomeTextureName: string,
        layout: typeof config.mysteryBox.layout,
        public soundManager: SoundManager
    ) {
        super();

        this.position.set(layout.x, layout.y);

        this.initBG(bgTextureName, layout);
        this.symbolsContainer = this.addChild(new PIXI.Container());
        this.symbols = this.initSymbols();
        this.mask = this.initMask(layout);
    }

    //<editor-fold desc="INIT">
    initBG(textureName: string, layout: typeof config.mysteryBox.layout): void {
        const bg = new PIXI.Sprite(getTexture(textureName));
        bg.anchor.set(0.5);

        bg.width = layout.size.width;
        bg.height = layout.size.height;

        this.addChild(bg);
    }

    /**
     * Mask will show only the outcome area, the rest will be covered
     * @param layout
     */
    initMask(layout: typeof config.mysteryBox.layout): PIXI.Graphics {
        const mask = new PIXI.Graphics();
        mask.beginFill(0xffffff);
        mask.drawRect(-layout.size.width / 2, -layout.size.height / 2, layout.size.width, layout.size.height);
        mask.endFill();

        return this.addChild(mask);
    }

    /**
     * List of symbols that will "spin":
     */
    initSymbols(): MysterySymbol[] {
        return this.getCheckpoints().map((checkpoint) => {
            const reelSymbol = new MysterySymbol(checkpoint);
            return this.symbolsContainer.addChild(reelSymbol);
        });
    }

    /**
     * Generating init positions for mystery symbols:
     */
    getCheckpoints(): number[] {
        const symHeight = config.mysteryBox.layout.size.height;
        const checkpoints = [];

        // one symbol is added above the outcome (for end bounce)
        // and one more - below it (for start bounce)
        for (let i = -1; i < 2; i++) {
            checkpoints.push(symHeight * i);
        }

        return checkpoints;
    }
    //</editor-fold>

    //<editor-fold desc="ANIMATIONS">
    async playRoundStart(): Promise<void> {
        await this.doStartBounce();

        this.soundManager.playSound("spin");

        for (let i = 0; i < config.mysteryBox.animation.startSequenceSymbols; i++) {
            await this.moveOneSlot();
        }
    }

    doStartBounce(): Promise<void[]> {
        this.soundManager.playSound("bounce");
        return Promise.all(
            this.symbols.map((sym) => {
                return sym.startBounce();
            })
        );
    }

    async moveOneSlot(newSymTexture?: string): Promise<void> {
        await Promise.all(
            this.symbols.map((sym) => {
                return sym.moveOneSlot();
            })
        );
        this.moveLastSymToStart(newSymTexture);
    }

    doEndBounce(): Promise<void[]> {
        return Promise.all(
            this.symbols.map((sym) => {
                return sym.endBounce();
            })
        );
    }

    moveLastSymToStart(newSymTexture?: string): void {
        const lastSym = this.symbols[this.symbols.length - 1];
        lastSym.resetToStart(newSymTexture);

        // changing container layering order
        this.symbolsContainer.setChildIndex(lastSym, 0);

        // making symbols follow the container children order
        this.symbols.sort((a, b) => {
            return this.symbolsContainer.children.indexOf(a) - this.symbolsContainer.children.indexOf(b);
        });
    }

    async presentOutcome(textureName: string): Promise<void> {
        const symbolsBeforeOutcome = config.mysteryBox.animation.startSequenceSymbols;
        for (let i = 0; i <= symbolsBeforeOutcome; i++) {
            // putting game round result on the last symbols to enter outcome area:
            await this.moveOneSlot(i + 1 === symbolsBeforeOutcome ? textureName : undefined);
        }

        this.soundManager.stop("spin");
        this.soundManager.playSound("bounce");

        await this.doEndBounce();
    }

    async reset(): Promise<void> {
        await Promise.all(
            this.symbols.map((sym) => {
                return sym.reset();
            })
        );
    }
    //</editor-fold>
}
