import { getScreenCenter } from "../game/utils";

export interface LayoutConfig {
    x: number;
    y: number;
    size?: {
        width: number;
        height: number;
    };
}

const gameLayout = {
    gameWidth: 1136,
    gameHeight: 640,
};

export const config = {
    gameAreaSize: gameLayout,
    gameOptions: {
        images: ["sym1", "sym2", "sym3", "sym4", "sym5", "sym6", "sym7", "sym8", "sym9"],
        offsets: {
            left: 100,
            right: 1036,
            top: 400,
        },
        size: {
            width: 100,
            height: 100,
        },
        maxSelectedPerRound: 5,
    },
    button: {
        image: "button",
        layout: {
            x: 568,
            y: 550,
        },
    },
    mysteryBox: {
        bg: "blank",
        outcome: "mystery",
        layout: {
            x: getScreenCenter(gameLayout).x,
            y: 150,
            size: {
                width: 200,
                height: 200,
            },
        },
        animation: {
            timeToMoveOneSlot: 0.2,
            startSequenceSymbols: 5,
            endSequenceSymbols: 10,
            startBounce: {
                duration: 0.5,
                distance: -50,
            },
            endBounce: {
                duration: 0.5,
                distance: 50,
            },
        },
    },
    presentationSplash: {
        win: {
            image: "win",
            x: getScreenCenter(gameLayout).x,
            y: getScreenCenter(gameLayout).y,
        },
        lose: {
            image: "lose",
            x: getScreenCenter(gameLayout).x,
            y: 300,
        },
    },
};
