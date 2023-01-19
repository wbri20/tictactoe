
import {
    Game
} from './../src/game'

describe("Tic Tac Toe Game", () => {
    it('should have JB pick a side X', async () => {
        let myGame = new Game();
        jest.spyOn(myGame, 'getInputFromReadline').mockReturnValue(new Promise(resolve => resolve('X')))
        const data = await myGame.inputPlayerSelection();
        expect(data).toBe('X');
    })

    it('should allow Jonas to randomly select O', async () => {
        let myGame = new Game();
        jest.spyOn(myGame, 'getInputFromReadline').mockReturnValue(new Promise(resolve => resolve('O')))
        const data = await myGame.inputPlayerSelection();
        expect(data).toBe('O');
    })

    // Jonas:
    it('should not allow X and O together only one team', async () => {
        let myGame = new Game();
        jest.spyOn(myGame, 'getInputFromReadline').mockReturnValue(new Promise(resolve => resolve('XO')))
        const data = await myGame.inputPlayerSelection();
        expect(data).not.toBe('XO');
    })

    // Jonas: What if I choose T 
    it('should not allow T only X or O', async () => {        
        let myGame = new Game();
        jest.spyOn(myGame, 'getInputFromReadline').mockReturnValue(new Promise(resolve => resolve('T')))
        const data = await myGame.inputPlayerSelection();
        expect(data).not.toBe('T');
    })
    // Jonas: What if I should select
    // TODO: Jonas: What if I want to play aganst you(Me) HXH
    it('should select the machine team', () => {
        let myGame = new Game();
        jest.spyOn(myGame, 'getPlayer').mockReturnValue('X')
        expect(myGame.assignMachineTeam()).toBeTruthy();
    })
    it('should have machine team opossite to players team if Player is X', async () => {
        let myGame = new Game();
        jest.spyOn(myGame, 'getPlayer').mockReturnValue('X')
        expect(myGame.assignMachineTeam()).toEqual("O");
    })
    it('should enter player in position 1', async()=> {
        let myGame = new Game();
        jest.spyOn(myGame, 'getPlayer').mockReturnValue('X')
        jest.spyOn(myGame, 'getInputFromReadline').mockReturnValue(new Promise(resolve => resolve(1))); 
        const data = await myGame.nextPlayerPosition();
        expect(data).toEqual(1);
    })
    it('should enter player in position 9', async()=> {
        let myGame = new Game();
        jest.spyOn(myGame, 'getPlayer').mockReturnValue('X')
        jest.spyOn(myGame, 'getInputFromReadline').mockReturnValue(new Promise(resolve => resolve(9))); 
        const data = await myGame.nextPlayerPosition();
        expect(data).toEqual(9);
    })
    it('should have machine play in first position', ()=> {
        let myGame = new Game();
        expect(myGame.nextMachineMove()).toBe(1)
    })
    it('should have machine choose position empty spot different than player', ()=> {
        let myGame = new Game();
        const player = "X"
        const playerPosition = 1

        jest.spyOn(myGame, 'getPlayer').mockReturnValue(player)
        myGame.populateBoard(1, player) //test
        expect(myGame.nextMachineMove()).not.toBe(playerPosition)
    })
    it('should indicate when player X wins', () => {
        let myGame = new Game();
        jest.spyOn(myGame, 'getBoard').mockReturnValue({
            1: 'X',
            2: 'X',
            3: 'X',
            4: '4',
            5: '5',
            6: '6',
            7: '7',
            8: '8',
            9: '9'
          })
        expect(myGame.calculateWinner()).toBe("X")
    })

    it('should indicate when player O wins', () => {
        let myGame = new Game();
        jest.spyOn(myGame, 'getBoard').mockReturnValue({
            1: 'X',
            2: 'X',
            3: 'O',
            4: '4',
            5: 'O',
            6: '6',
            7: 'O',
            8: '8',
            9: '9'
          })
        expect(myGame.calculateWinner()).toBe("O");
    })
    it('should check if game is draw', () =>{
        let myGame = new Game();
        expect(myGame.isDraw()).toBeTruthy();
    })
    it('should check if game is not draw', () =>{
        let myGame = new Game();
        expect(myGame.isDraw()).toBeFalsy();
    })
    // TODO: How to test UI/user interaction in jest
    // it.todo('should loop game with player inputs and machine move until there is a winner or draw', () => {
    //     let myGame = new Game();
    //     expect(myGame.runGame()).toBe("X")
    // });
})
