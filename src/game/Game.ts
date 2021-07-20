import * as PIXI from "pixi.js";
import { Button } from "./button";
import { config } from "../config/config";
import { MysteryBox } from "./mysteryBox/mysteryBox";
import { RoundManager } from "./roundManager";
import { getTexture } from "./utils";
import { GameOptionsManager } from "./gameOptions/gameOptionsManager";
import { PresentationSplash } from "./presentationSplash";
import { SoundManager } from "./SoundManager";

export class Game {
    root: PIXI.Container;
    soundManager: SoundManager;
    roundManager!: RoundManager;
    optionsManager!: GameOptionsManager;
    playButton!: Button;
    mysteryBox!: MysteryBox;
    presentationSplash!: PresentationSplash;

    constructor(parent: PIXI.Container) {
        this.root = parent.addChild(new PIXI.Container());
        this.soundManager = new SoundManager();
        this.init();
    }

    //<editor-fold desc="SETUP">
    init(): void {
        this.initBG();
        this.roundManager = new RoundManager(config.gameOptions.images.length);
        this.playButton = this.initPlayButton(config.button);
        this.optionsManager = new GameOptionsManager(
            this.root,
            this.onOptionSelected.bind(this),
            this.onOptionDeSelected.bind(this),
            this.soundManager
        );
        this.mysteryBox = this.initMysteryBox(config.mysteryBox);
        this.presentationSplash = new PresentationSplash(this.root);
    }

    initBG(): void {
        const backgroundSprite = new PIXI.Sprite(getTexture("background"));
        this.root.addChild(backgroundSprite);
    }

    initPlayButton(buttonConfig: typeof config["button"]): Button {
        const button = new Button(buttonConfig.image, () => this.playRound(), buttonConfig.layout, this.soundManager);
        button.disable();
        this.root.addChild(button);
        return button;
    }

    initMysteryBox(mysteryConfig: typeof config["mysteryBox"]): MysteryBox {
        const mysteryBox = new MysteryBox(
            mysteryConfig.bg,
            mysteryConfig.outcome,
            mysteryConfig.layout,
            this.soundManager
        );
        this.root.addChild(mysteryBox);
        return mysteryBox;
    }
    //</editor-fold>

    start(): void {
        this.soundManager.playSound("ambient");
    }

    //<editor-fold desc="INTERACTIONS">
    onOptionSelected(optionIndex: number): void {
        this.roundManager.processOptionSelection(optionIndex);

        if (this.roundManager.isSelectedOptionsLimitReached) {
            this.optionsManager.disableNonSelected();
        }

        this.playButton.enable();
    }

    onOptionDeSelected(optionIndex: number): void {
        this.roundManager.processOptionDeSelection(optionIndex);

        if (this.roundManager.isNothingSelected) {
            this.playButton.disable();
        }

        this.optionsManager.enableAll();
    }

    disableInteraction(): void {
        this.optionsManager.disableAll();
        this.playButton.disable();
    }
    //</editor-fold>

    //<editor-fold desc="PRESENTATIONS">
    async playRound(): Promise<void> {
        this.disableInteraction();

        const roundResult = await this.processRoundStart();

        await this.presentation(roundResult);

        await this.reset();
    }

    async processRoundStart(): Promise<{ outcome: number; isWin: boolean }> {
        const roundStartHandler = await Promise.all([this.roundManager.playRound(), this.mysteryBox.playRoundStart()]);

        return roundStartHandler[0];
    }

    async presentation(roundResult: { outcome: number; isWin: boolean }): Promise<void> {
        const textureName = config.gameOptions.images[roundResult.outcome];

        await this.mysteryBox.presentOutcome(textureName);

        if (roundResult.isWin) {
            this.soundManager.playSound("win");
            await this.optionsManager.playWin(roundResult.outcome);
            await this.presentationSplash.playWin();
        } else {
            this.soundManager.playSound("lost");
            await this.presentationSplash.playLose();
        }
    }

    reset(): Promise<void[]> {
        return Promise.all([this.mysteryBox.reset(), this.optionsManager.reset()]);
    }
    //</editor-fold>
}
