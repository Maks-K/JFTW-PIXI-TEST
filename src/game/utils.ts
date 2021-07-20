import * as PIXI from "pixi.js";

export function getTexture(textureName: string): PIXI.Texture {
    return PIXI.Loader.shared.resources[textureName].texture || PIXI.Texture.WHITE;
}

export function getScreenCenter(gameLayout: { gameWidth: number; gameHeight: number }): { x: number; y: number } {
    return {
        x: gameLayout.gameWidth / 2,
        y: gameLayout.gameHeight / 2,
    };
}
