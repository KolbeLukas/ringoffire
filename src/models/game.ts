export class Game {
    public players: string[] = [];
    public playersIcon: number[] = [];
    public stack: string[] = [];
    public playedCards: string[] = [];
    public currentPlayer: number = 0;
    public pickCardAnimation: boolean = false;
    public currentCard: string | undefined = '';
    public stackCount: number = 10;
    public cardTurn: number = 0;
    public visibleStack: string[] = [];

    constructor() {
        for (let i = 1; i < 14; i++) {      //14
            this.stack.push('clubs_' + i);
            this.stack.push('diamonds_' + i);
            this.stack.push('hearts_' + i);
            this.stack.push('spades_' + i);
        }
        this.shuffle(this.stack);
        this.visibleStack = this.stack.slice(0, this.stackCount);
    }

    public toJson() {
        return {
            players: this.players,
            playersIcon: this.playersIcon,
            stack: this.stack,
            playedCards: this.playedCards,
            currentPlayer: this.currentPlayer,
            pickCardAnimation: this.pickCardAnimation,
            currentCard: this.currentCard,
            stackCount: this.stackCount,
            cardTurn: this.cardTurn,
            visibleStack: this.visibleStack
        };
    }
    

    shuffle(array: any) {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }
}