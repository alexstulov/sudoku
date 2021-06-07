class Utility {
    static cross (a, b) {
        var result = [];
        for(var ai in a){
            for(var bi in b){
                result.push(a[ai] + b[bi]);
            }
        }
        return result;
    }

    static in (v, seq) {
        return seq.indexOf(v) !== -1;
    }

    static firstTrue (seq) {
        for(var i in seq){
            if(seq[i]){
                return seq[i];
            }
        }
        return false;
    }

    static shuffle = function(seq){
        var shuffled = [];
        for(var i = 0; i < seq.length; ++i){
            shuffled.push(false);
        }
        
        for(var i in seq){
            var ti = Utility.randRange(seq.length);
            
            while(shuffled[ti]){
                ti = (ti + 1) > (seq.length - 1) ? 0 : (ti + 1);
            }
            
            shuffled[ti] = seq[i];
        }
        
        return shuffled;
    }

    static randRange (max, min) {
        min = min || 0;
        if(max){
            return Math.floor(Math.random() * (max - min)) + min;
        } else {
            throw "Range undefined";
        }
    }

    static stripDups (seq) {
        var seqSet = [];
        var dupMap = {};
        for(var i in seq){
            var e = seq[i];
            if(!dupMap[e]){
                seqSet.push(e);
                dupMap[e] = true;
            }
        }
        return seqSet;
    }

    static forceRange (nr, max, min) {
        min = min || 0
        nr = nr || 0
        if(nr < min){
            return min;
        }
        if(nr > max){
            return max;
        }
        return nr
    }

    static getAllUnits (rows, cols) {
        var units = [];

        for(var ri in rows){
            units.push(Utility.cross(rows[ri], cols));
        }

        for(var ci in cols){
           units.push(Utility.cross(rows, cols[ci]));
        }

        var rowSquares = ["ABC", "DEF", "GHI"];
        var colSquares = ["123", "456", "789"];
        for(var rsi in rowSquares){
            for(var csi in colSquares){
                units.push(Utility.cross(rowSquares[rsi], colSquares[csi]));
            }
        }

        return units;
    }

    static getSquareUnitsMap (squares, units) {
        var squareUnitMap = {};

        for(var si in squares){
            var curSquare = squares[si];

            var curSquareUnits = [];

            for(var ui in units){
                var curUnit = units[ui];

                if(curUnit.indexOf(curSquare) !== -1){
                    curSquareUnits.push(curUnit);
                }
            }

            squareUnitMap[curSquare] = curSquareUnits;
        }

        return squareUnitMap;
    }

    static getSquarePeersMap (squares, unitsMap) {
        var squarePeersMap = {};

        for(var si in squares){
            var curSquare = squares[si];
            var curSquareUnits = unitsMap[curSquare];

            var curSquarePeers = [];

            for(var sui in curSquareUnits){
                var curUnit = curSquareUnits[sui];

                for(var ui in curUnit){
                    var curUnitSquare = curUnit[ui];

                    if(curSquarePeers.indexOf(curUnitSquare) === -1 && 
                            curUnitSquare !== curSquare){
                        curSquarePeers.push(curUnitSquare);
                    }
                }
            }
            
            squarePeersMap[curSquare] = curSquarePeers;
        }

        return squarePeersMap;
    }
}

export {Utility};