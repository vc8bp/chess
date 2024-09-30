import { BOARDCOLS, BOARDROWS } from "./Board";

const getRowColIndex = (coordinate) => {
  const [col, row] = coordinate.split("");
  return [BOARDCOLS.indexOf(col), BOARDROWS.indexOf(parseInt(row))];
};

const isEmptySquare = (square, piecesPlacement) => !piecesPlacement[square];



const getPawnMoves = (activePiece, activePieceColor, piecesPlacement) => {
  const [colIdx, rowIdx] = getRowColIndex(activePiece);
  const moves = {};
  
  const direction = activePieceColor === "l" ? -1 : 1;

  const forwardMove = `${BOARDCOLS[colIdx]}${BOARDROWS[rowIdx + direction]}`;
  const twoForawrdMove = `${BOARDCOLS[colIdx]}${BOARDROWS[rowIdx + (2 * direction)]}`;

  if (isEmptySquare(forwardMove, piecesPlacement)) { //normal move
    moves[forwardMove] = false 
  } 
  if(rowIdx == (activePieceColor == "d" ? 1 : 6) && isEmptySquare(twoForawrdMove, piecesPlacement)) { //if it's 1st move
    moves[twoForawrdMove] = false 
  }

  const captureLeft = `${BOARDCOLS[colIdx - 1]}${BOARDROWS[rowIdx + direction]}`;
  const captureRight = `${BOARDCOLS[colIdx + 1]}${BOARDROWS[rowIdx + direction]}`;

  if (captureLeft && piecesPlacement[captureLeft]?.startsWith(activePieceColor === "l" ? "d" : "l")) {
    moves[captureLeft] = true
  }
  if (captureRight && piecesPlacement[captureRight]?.startsWith(activePieceColor === "l" ? "d" : "l")) {
    moves[captureRight] = true
  }

  return moves;
};

const getKingMoves = (activePiece, activePieceColor, piecesPlacement) => {
    const [colIdx, rowIdx] = getRowColIndex(activePiece);
  
    const moveDirections = [
      { col: 0, row: 1 },  
      { col: 0, row: -1 },  
      { col: 1, row: 0 },  
      { col: -1, row: 0 },  
      { col: 1, row: 1 },   
      { col: -1, row: 1 },  
      { col: 1, row: -1 }, 
      { col: -1, row: -1 }  
    ];
  
    const isValidPosition = (col, row) => (
      col >= 0 && col < BOARDCOLS.length && row >= 0 && row < BOARDROWS.length
    );

  
    const canMoveTo = (targetPos) => {
      const targetPiece = piecesPlacement[targetPos];
      if (!targetPiece) return true; 
      const [targetColor] = targetPiece.split("-");
      return targetColor !== activePieceColor; 
    };
  
    const possibleMoves = []
    moveDirections.forEach(({ col, row }) => {
        const newColIdx = colIdx + col;
        const newRowIdx = rowIdx + row;

        if (isValidPosition(newColIdx, newRowIdx)) {
                
        }
        return null;
    })
    //   .filter(canMoveTo); // Check if the king can move to the position
  
    return possibleMoves;
  };
  

export const getPossibleMoves = (activePiece, piecesPlacement) => {
  const pieceInfo = piecesPlacement[activePiece]; 
  if (!pieceInfo) return [];

  const [activePieceColor, activePieceType] = pieceInfo.split("-");
  let possibleMoves = [];

  switch (activePieceType) {
    case "pawn":
        possibleMoves = getPawnMoves(activePiece, activePieceColor, piecesPlacement);
        break;
    case "king":
        possibleMoves = getKingMoves(activePiece, activePieceColor, piecesPlacement);
        break;
    default:
      break;
  }

  return possibleMoves;
};
