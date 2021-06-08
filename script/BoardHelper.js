class BoardHelper {
    static boardStringToGrid (boardString) {
        var rows = [];
        var curRow = [];
        for(var i in boardString){
            curRow.push(boardString[i]);
            if(i % 9 == 8){
                rows.push(curRow);
                curRow = [];
            }
        }
        return rows;
    }

    static boardGridToString (boardGrid) {
        var boardString = "";
        for(var r = 0; r < 9; ++r){
            for(var c = 0; c < 9; ++c){
                boardString += boardGrid[r][c];
            }   
        }
        return boardString;
    }

    static printBoard (board) {
        var VPADDING = " ";  // Insert after each square
        var HPADDING = '\n'; // Insert after each row
        
        var VBOXPADDING = "  "; // Box vertical padding
        var HBOXPADDING = '\n'; // Box horizontal padding

        var displayString = "";
        
        for(var i in board){
            var square = board[i];
            
            displayString += square + VPADDING;
            
            if(i % 3 === 2){
                displayString += VBOXPADDING;
            }
            
            if(i % 9 === 8){
                displayString += HPADDING;
            }
            
            if(i % 27 === 26){
                displayString += HBOXPADDING;
            }
        }

        console.log(displayString);
    }

    static getSquareValsMap (board, squares) {
        var squaresValsMap = {};
        
        if(board.length != squares.length){
            throw "Board/squares length mismatch.";
            
        } else {
            for(var i in squares){
                squaresValsMap[squares[i]] = board[i];
            }
        }
        
        return squaresValsMap;
    }
}

export {BoardHelper};