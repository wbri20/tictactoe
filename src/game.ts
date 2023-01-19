import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

enum INIT_VAL {
    size = 9 // 3X3
}

enum PLAYERS {
    X = "X",
    O = "O"
}

// Oh goes first
type playerLookupTable = {
    [key: string]: string
}
type lookupTable = {
    [key: number]: string
};


export class Game {
    private player: string;
    private machine: string;
    private playersAssigningTbl: playerLookupTable;
    private myBoard: lookupTable;
    private winnerTable:  Array<Array<number>>;

    constructor(){
        this.player = "";
        this.machine = ""
        // Refactor
        this.playersAssigningTbl = {
            "X": "O",
            "O": "X"
        }
        this.myBoard = {
            1: '1',
            2: '2',
            3: '3',
            4: '4',
            5: '5',
            6: '6',
            7: '7',
            8: '8',
            9: '9'
          };
        /* horizontal: 123, 456, 789 or vertical: 147 258 369, diagonal: 159 357 same */
        this.winnerTable = [
            // horizontal
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            // vertical
            [1, 4, 7],
            [2, 5, 8],
            [3, 6, 9],
            // diagonal
            [1, 5, 9],
            [3, 5, 7]
        ]
    }

    async getInputFromReadline(question: string): Promise<any> {
        const rl = readline.createInterface({ input, output });
        let answer:string = await rl.question(question);
        rl.close();
        return answer;
    }

    async inputPlayerSelection(): Promise<string> {
        const player = await this.getInputFromReadline('Enter Your Uniform. Choose X or O: ');
        if(player !== PLAYERS.X && player !== PLAYERS.O) {
            console.log('Please, enter only X or O');
            return '_';
        } else {
            this.assignPlayer(player); // mock
            return player;
        }
    }

    assignPlayer(player: string) {
        this.player = player
    }

    getPlayer(): string {
        return this.player;
    }
    
    assignMachineTeam() {
        const m = this.getPlayer()
        this.machine = this.playersAssigningTbl[m]; // R=> ENUM
        return this.machine;
    }

    async nextPlayerPosition(): Promise<any> {
        const answer = await this.getInputFromReadline('Enter Your Position 1-9: ');
        const player = this.getPlayer();
        if(Object.keys(this.myBoard).includes(answer)) {
            this.populateBoard(Number(answer), player);
        } else {
            console.log("Enter only number 1-9");
        }
        return answer;
    }

    populateBoard(position: number, cellData: string) {
        // TODO: Asign only empty
        this.myBoard[position] = cellData
    }

    //Output the board to the console // make number count number smaller
    printBoard() {
        console.log('\n' +
        ' ' + this.myBoard[1] + ' | ' + this.myBoard[2] + ' | ' + this.myBoard[3] + '\n' +
        ' ---------\n' +
        ' ' + this.myBoard[4] + ' | ' + this.myBoard[5] + ' | ' + this.myBoard[6] + '\n' +
        ' ---------\n' +
        ' ' + this.myBoard[7] + ' | ' + this.myBoard[8] + ' | ' + this.myBoard[9] + '\n');
    }

    nextMachineMove(): number {
        const player = this.getPlayer()
        const machine = this.playersAssigningTbl[player];
        let pos: number = -1;
        const board = this.getBoard();

        for(let i = 1; i < INIT_VAL.size; i++) {
            if(board[i] !== PLAYERS.O && board[i] !== PLAYERS.X) {
                board[i] = machine;
                pos = i;
                break;
            }
        }
        return pos;
    }

    getBoard():lookupTable {
        return this.myBoard;
    }

    calculateWinner(): string {
        // whos is a winner if it matches, all potential win for
        /* horizontal: 123, 456, 789 or vertical: 147 258 369, diagonal: 159 357 same */
        let winnerPlayer: string = '_';
        const board = this.getBoard();
        for(const winnerRow of this.winnerTable){
            let isWinner:boolean = true; 
            let prevIndex:number = winnerRow[0];
            winnerPlayer = board[prevIndex];
            for(let i:number = 1; i < winnerRow.length; i++) {
                const currIndex = winnerRow[i];
                if(board[prevIndex] !== board[currIndex]) {
                    isWinner = false;
                    break;
                }
            }
            if(isWinner) {
                return winnerPlayer;
            } else {
                winnerPlayer = '_';
            }
            
        }
        return winnerPlayer;
    }

    isDraw(): boolean {
        const board = this.getBoard();
        for(const cell of Object.values(board)){
            if(cell !== PLAYERS.O && cell !== PLAYERS.X) {
                return false;
            }
        }
        return true;
    }

    async runGame() {
        this.printBoard();
        await this.inputPlayerSelection();
        // get inputs and play
        while(true) {
            await this.nextPlayerPosition();
            this.printBoard();
            const isWinner:string =  this.calculateWinner();
            if(isWinner !== '_') {
                console.log('the winner is: ', isWinner);
                break;
            }
            const isDraw:boolean =  this.isDraw();
            if(isDraw) {
                console.log('There is a draw!');
                break;
            }
            this.nextMachineMove();
            this.printBoard();
        }
    }
}