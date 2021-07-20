import { config } from "../config/config";

export class RoundManager {
    selectedOptions: number[] = [];
    optionsNumber: number;

    constructor(optionsNumber: number) {
        this.optionsNumber = optionsNumber;
    }

    processOptionSelection(option: number): void {
        if (!this.selectedOptions.includes(option)) {
            this.selectedOptions.push(option);
        } else {
            console.error(`Error, trying to select game option ${option}, that is already selected`);
        }
    }

    processOptionDeSelection(option: number): void {
        if (this.selectedOptions.includes(option)) {
            this.selectedOptions.splice(this.selectedOptions.indexOf(option), 1);
        } else {
            console.error(`Error, trying to unselect option ${option}, that is not selected`);
        }
    }

    /**
     * Added promise wrapper to emulate asynchronous action of communicating with serer:
     */
    playRound(): Promise<{ outcome: number; isWin: boolean }> {
        const outcome = Math.floor(Math.random() * this.optionsNumber);

        return Promise.resolve({
            outcome,
            isWin: this.selectedOptions.includes(outcome),
        });
    }

    get isSelectedOptionsLimitReached(): boolean {
        return this.selectedOptions.length >= config.gameOptions.maxSelectedPerRound;
    }

    get isNothingSelected(): boolean {
        return this.selectedOptions.length === 0;
    }
}
