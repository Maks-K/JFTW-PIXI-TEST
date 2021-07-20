import * as PIXI from "pixi.js";
import { config } from "../../config/config";
import { GameOption } from "./GameOption";
import { SoundManager } from "../SoundManager";

export class GameOptionsManager {
    options: GameOption[];
    rootContainer: PIXI.Container;

    constructor(
        parent: PIXI.Container,
        public onOptionSelected: (index: number) => void,
        public onOptionDeSelected: (index: number) => void,
        public soundManager: SoundManager
    ) {
        this.rootContainer = parent.addChild(new PIXI.Container());
        this.options = this.initGameOptions(parent, config.gameOptions);
    }

    /**
     * Creating all the game options buttons
     * @param parent
     * @param symbolsConfig
     */
    initGameOptions(parent: PIXI.Container, symbolsConfig: typeof config["gameOptions"]): GameOption[] {
        function getOptionPositionX(index: number) {
            const leftBound = symbolsConfig.offsets.left;
            const rightBound = symbolsConfig.offsets.right;
            const maxOptionIndex = symbolsConfig.images.length - 1;
            return leftBound + (index * (rightBound - leftBound)) / maxOptionIndex;
        }

        return symbolsConfig.images.map((imageName, index) => {
            return this.rootContainer.addChild(
                new GameOption(
                    imageName,
                    () => this.onOptionSelected(index),
                    () => this.onOptionDeSelected(index),
                    {
                        x: getOptionPositionX(index),
                        y: symbolsConfig.offsets.top,
                        size: symbolsConfig.size,
                    },
                    this.soundManager
                )
            );
        });
    }

    playWin(optionIndex: number): Promise<void> {
        return this.options[optionIndex].playWin();
    }

    disableAll(): void {
        this.options.forEach((opt) => opt.disable());
    }

    enableAll(): void {
        this.options.forEach((opt) => opt.enable());
    }

    disableNonSelected(): void {
        this.options.forEach((opt) => {
            if (!opt.isSelected) {
                opt.disable();
            }
        });
    }

    /**
     * Resetting game options to original state on round end:
     */
    async reset(): Promise<void> {
        await Promise.all(
            this.options.map((opt) => {
                if (opt.isSelected) {
                    return opt.reset();
                }
            })
        );

        this.enableAll();
    }
}
