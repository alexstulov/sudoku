import { Sudoku } from './Sudoku.js';

let currentCell = null;
const gameField = document.querySelector('#game-field');

const navButtons = document.querySelectorAll('button');
navButtons.forEach((button) => {
    button.addEventListener('click', () => {
        toggleVisibility(button.dataset.link)
    })
});
const newGameButton = document.querySelector('#show-new-game');
let puzzle = '';
let solution = '';
newGameButton.addEventListener('click', () => {
    const sudoku = new Sudoku();
    puzzle = sudoku.generate('easy');
    solution = sudoku.solve(puzzle);
    const cells = [];
    for (let i = 0; i < puzzle.length; i++) {
        const newCell = document.createElement('div');
        const number = puzzle[i];
        newCell.classList.add('cell');
        newCell.classList.add('middlify');
        newCell.dataset['index'] = i;
        if (number === '.') {
            newCell.classList.add('editable');
            newCell.addEventListener('click', () => {
                if (currentCell === newCell) {
                    currentCell.classList.remove('focused');
                    currentCell = null;
                    return;
                }
                gameField.querySelectorAll('.cell').forEach((cell) => cell.classList.remove('focused'));
                currentCell = newCell;
                currentCell.classList.add('focused');
            });
            cells.push(newCell);
        } else {
            newCell.innerText = number;
            cells.push(newCell);
        }
    }

    const pickButtonElements = document.querySelectorAll('.pick-number-buttons .pick-number')//.querySelectorAll('.coordinate');
    pickButtonElements.forEach((element) => {
        element.addEventListener('click', (event) => {
            if (currentCell) {
                currentCell.innerText = event.target.innerText;
                currentCell.classList.remove('focused');
                currentCell = null;
                checkMove();
            }
        });
    });
    gameField.innerHTML = '';
    gameField.append(...cells);
});

function toggleVisibility(page) {
    const allPages = document.querySelectorAll('.page');
    const pageEl = document.querySelector(`#${page}-page`);
    allPages.forEach((page) => {
        page.classList.add('hidden');
    });
    const mainHomeButton = document.querySelector('#main-home');
    if (page === 'home') {
        mainHomeButton.classList.add('hidden');
    } else {
        mainHomeButton.classList.remove('hidden');
    }
    pageEl.classList.remove('hidden');
}

toggleVisibility('new-game');
newGameButton.click();

const checkMove = () => {
    const userInputs = document.querySelector('#game-field').querySelectorAll('.cell.editable');
    let emptyCount = 0;
    let errorsCount = 0;
    userInputs.forEach(userInput => {
        const index = userInput.dataset['index'];
        const value = userInput.innerText;
        console.log(index, value, solution[index]);
        userInput.classList.remove('error');
        if (!value) {
            emptyCount++;
        }
        if (value && value !== solution[index]) {
            userInput.classList.add('error');
            errorsCount++;
        }
    });
    if (!emptyCount && !errorsCount) {
        alert('Congrats! You did it!');
    }
}

