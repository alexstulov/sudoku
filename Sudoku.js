import {BoardHelper} from './BoardHelper.js';
import {Utility} from './Utility.js';

class Sudoku {
    #digits = "123456789";
    #rows = "ABCDEFGHI";
    #cols = this.#digits;
    #minGivens = 17;
    #numberOfSquares = 81;
    #difficulty = {
        "easy":         62,
        "medium":       53,
        "hard":         44,
        "very-hard":    35,
        "insane":       26,
        "inhuman":      17,
    };
    #blankChar = '.';
    #blankBoard = '.'.repeat(this.#numberOfSquares);

    constructor() {
        this.squares = Utility.cross(this.#rows, this.#cols);
        this.units = Utility.getAllUnits(this.#rows, this.#cols);
        this.squareUnitsMap = Utility.getSquareUnitsMap(this.squares, this.units);
        this.squarePeersMap = Utility.getSquarePeersMap(this.squares, this.squareUnitsMap);
    }

    generate(difficulty, unique) {
        if(typeof difficulty === "string" || typeof difficulty === "undefined"){
            difficulty = this.#difficulty[difficulty] || this.#difficulty.easy;
        }
        
        difficulty = Utility.forceRange(difficulty, this.#numberOfSquares + 1, 
                this.#minGivens);
        
        unique = unique || true;
        
        var candidates = this.#getCandidatesMap(this.#blankBoard);
        
        var shuffledSquares = Utility.shuffle(this.squares);
        for(var si in shuffledSquares){
            var square = shuffledSquares[si];
            
            var randCandidateIdx = 
            Utility.randRange(candidates[square].length);
            var randCandidate = candidates[square][randCandidateIdx];
            if(!this.#assign(candidates, square, randCandidate)){
                break;
            }
            
            var singleCandidates = [];
            for(var si in this.squares){
                var square = this.squares[si];
                
                if(candidates[square].length == 1){
                    singleCandidates.push(candidates[square]);
                }
            }
            
            if(singleCandidates.length >= difficulty && 
                Utility.stripDups(singleCandidates).length >= 8){
                var board = "";
                var givensIdxs = [];
                for(var i in this.squares){
                    var square = this.squares[i];
                    if(candidates[square].length == 1){
                        board += candidates[square];
                        givensIdxs.push(i);
                    } else {
                        board += this.#blankChar;
                    }
                }
                
                var nrGivens = givensIdxs.length;
                if(nrGivens > difficulty){
                    givensIdxs = Utility.shuffle(givensIdxs);
                    for(var i = 0; i < nrGivens - difficulty; ++i){
                        var target = parseInt(givensIdxs[i]);
                        board = board.substr(0, target) + this.#blankChar + 
                            board.substr(target + 1);
                    }
                }
                
                if(this.solve(board)){
                    return board;
                }
            }
        }
        
        return this.generate(difficulty);
    }

    // Solve
    solve(board, reverse) {
        var report = this.validateBoard(board);
        if(report !== true){
            throw report;
        }
        
        var nrGivens = 0;
        for(var i in board){
            if(board[i] !== this.#blankChar && Utility.in(board[i], this.#digits)){
                ++nrGivens;
            }
        }
        if(nrGivens < this.#minGivens){
            throw "Too few givens. Minimum givens is " + this.#minGivens;
        }

        reverse = reverse || false;

        var candidates = this.#getCandidatesMap(board);
        var result = this.#search(candidates, reverse);
        
        if(result){
            var solution = "";
            for(var square in result){
                solution += result[square];
            }
            return solution;
        }
        return false;
    }

    getCandidates(board) {
        var report = this.validateBoard(board);
        if(report !== true){
            throw report;
        }
        
        // Get a candidates map
        var candidatesMap = this.#getCandidatesMap(board);
        
        // If there's an error, return false
        if(!candidatesMap){
            return false;
        }
        
        // Transform candidates map into grid
        var rows = [];
        var curRow = [];
        var i = 0;
        for(var square in candidatesMap){
            var candidates = candidatesMap[square];
            curRow.push(candidates);
            if(i % 9 == 8){
                rows.push(curRow);
                curRow = [];
            }
            ++i;
        }
        return rows;
    }

    #getCandidatesMap (board) {
        var report = this.validateBoard(board);
        if(report !== true){
            throw report;
        }
        
        var candidateMap = {};
        var squaresValuesMap = BoardHelper.getSquareValsMap(board, this.squares);
        
        for(var si in this.squares){
            candidateMap[this.squares[si]] = this.#digits;
        }
        
        for(var square in squaresValuesMap){
            var val = squaresValuesMap[square];
            
            if(Utility.in(val, this.#digits)){
                var newCandidates = this.#assign(candidateMap, square, val);
                
                if(!newCandidates){
                    return false;
                }
            }
        }
        
        return candidateMap;
    }

    #search (candidates, reverse) {
        if(!candidates){
            return false;
        }
        
        reverse = reverse || false;
        
        var maxNrCandidates = 0;
        var maxCandidatesSquare = null;
        for(var si in this.squares){
            var square = this.squares[si];
            
            var nrCandidates = candidates[square].length;
                
            if(nrCandidates > maxNrCandidates){
                maxNrCandidates = nrCandidates;
                maxCandidatesSquare = square;
            }
        }
        if(maxNrCandidates === 1){
            return candidates;
        }
        
        var minNrCandidates = 10;
        var minCandidatesSquare = null;
        for(si in this.squares){
            var square = this.squares[si];
            
            var nrCandidates = candidates[square].length;
            
            if(nrCandidates < minNrCandidates && nrCandidates > 1){
                minNrCandidates = nrCandidates;
                minCandidatesSquare = square;
            }
        }

        var minCandidates = candidates[minCandidatesSquare];
        if(!reverse){
            for(var vi in minCandidates){
                var val = minCandidates[vi];
                
                var candidatesCopy = JSON.parse(JSON.stringify(candidates));
                var candidatesNext = this.#search(
                    this.#assign(candidatesCopy, minCandidatesSquare, val)
                );
                
                if(candidatesNext){
                    return candidatesNext;
                }
            }
            
        } else {
            for(var vi = minCandidates.length - 1; vi >= 0; --vi){
                var val = minCandidates[vi];
                
                var candidatesCopy = JSON.parse(JSON.stringify(candidates));
                var candidatesNext = this.#search(
                    this.#assign(candidatesCopy, minCandidatesSquare, val), 
                    reverse
                );
                
                if(candidatesNext){
                    return candidatesNext;
                }
            }
        }
        
        return false;
    }

    #assign (candidates, square, val) {
        var otherVals = candidates[square].replace(val, "");

        for(var ovi in otherVals){
            var otherVal = otherVals[ovi];

            var candidatesNext =
                this.#eliminate(candidates, square, otherVal);

            if(!candidatesNext){
                return false;
            }
        }

        return candidates;
    }

    #eliminate (candidates, square, val) {
        if(!Utility.in(val, candidates[square])){
            return candidates;
        }

        candidates[square] = candidates[square].replace(val, '');
           
        var nrCandidates = candidates[square].length;
        if(nrCandidates === 1){
            var targetVal = candidates[square];
            
            for(var pi in this.squarePeersMap[square]){
                var peer = this.squarePeersMap[square][pi];
                
                var candidatesNew = 
                        this.#eliminate(candidates, peer, targetVal);
                        
                if(!candidatesNew){
                    return false;
                }
            }
        
        } if(nrCandidates === 0){
            return false;
        }
        
        for(var ui in this.squareUnitsMap[square]){
            var unit = this.squareUnitsMap[square][ui];
            
            var valPlaces = [];
            for(var si in unit){
                var unitSquare = unit[si];
                if(Utility.in(val, candidates[unitSquare])){
                    valPlaces.push(unitSquare);
                }
            }
            
            if(valPlaces.length === 0){
                return false;
                
            } else if(valPlaces.length === 1){
                var candidatesNew = 
                    this.#assign(candidates, valPlaces[0], val);
                
                if(!candidatesNew){
                    return false;
                }
            }
        }
        
        return candidates;
    }

    // Utility
    printBoard (board) {
        var report = this.validateBoard(board);
        if(report !== true){
            throw report;
        }
        
        BoardHelper.printBoard(board);
    }

    validateBoard (board) {
        if(!board){
            return "Empty board";
        }
        
        if(board.length !== this.#numberOfSquares){
            return "Invalid board size. Board must be exactly " + this.#numberOfSquares +
                    " squares.";
        }
        
        for(var i in board){
            if(!Utility.in(board[i], this.#digits) && board[i] !== this.#blankChar){
                return "Invalid board character encountered at index " + i + 
                        ": " + board[i];
            }
        }
        
        return true;
    }
}

export {Sudoku};