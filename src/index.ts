import * as PIXI from "pixi.js";
import "./style.css";
import Assets from "./assets";
import { Game } from "./game/game";
import { config } from "./config/config";

const { gameWidth, gameHeight } = config.gameAreaSize;

const app = new PIXI.Application({
    backgroundColor: 0xd3d3d3,
    width: gameWidth,
    height: gameHeight,
});

const stage = app.stage;

window.onload = async (): Promise<void> => {
    await loadGameAssets();

    document.body.appendChild(app.view);

    resizeCanvas();

    const game = new Game(stage);
    game.start();
};

async function loadGameAssets(): Promise<PIXI.Loader> {
    return new Promise((res, rej) => {
        const loader = PIXI.Loader.shared;

        for (const asset in Assets) {
            loader.add(asset, Assets[asset]);
        }

        loader.onComplete.once(() => {
            res(loader);
        });

        loader.onError.once(() => {
            rej();
        });

        loader.load();
    });
}

function resizeCanvas(): void {
    const resize = () => {
        const canvas = app.view;
        //Figure out the scale amount on each axis
        const scaleX = window.innerWidth / canvas.offsetWidth;
        const scaleY = window.innerHeight / canvas.offsetHeight;

        //Scale the canvas based on whichever value is less: `scaleX` or `scaleY`
        const scale = Math.min(scaleX, scaleY);
        canvas.style.transform = "scale(" + scale + ")";
    };

    resize();

    window.addEventListener("resize", resize);
}
