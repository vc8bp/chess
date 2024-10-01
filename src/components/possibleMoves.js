import { BOARDCOLS, BOARDROWS } from "../assets/constants";

const getRowColIndex = (coordinate) => {
  const [col, row] = coordinate.split("");
  return [BOARDCOLS.indexOf(col), BOARDROWS.indexOf(parseInt(row))];
};

const isEmptySquare = (square, piecesPlacement) => !piecesPlacement[square];

const isValidPosition = (col, row) => (
  col >= 0 && col < BOARDCOLS.length && row >= 0 && row < BOARDROWS.length
);

const generateMoves = (colIdx, rowIdx, directions, activePieceColor, piecesPlacement, isOneMove = false) => {
  const moves = {};

  directions.forEach(direction => {
    let newCol = colIdx + direction.col;
    let newRow = rowIdx + direction.row;

    while (isValidPosition(newCol, newRow)) {
      const newCord = `${BOARDCOLS[newCol]}${BOARDROWS[newRow]}`;
      const targetPiece = piecesPlacement[newCord];

      if (targetPiece) {
        const [color] = targetPiece.split("-");
        if (color !== activePieceColor) moves[newCord] = targetPiece; // Capture Move
        break;
      } else {
        moves[newCord] = false; // Empty
      }


      newCol += direction.col;
      newRow += direction.row;

      if(isOneMove) break; // king only moves 1
    }
  });

  console.log({moves})
  return moves;
};

const getHorizontalVerticalMoves = (colIdx, rowIdx, activePieceColor, piecesPlacement) => {
  const directions = [
    { col: 1, row: 0 },   // Right
    { col: -1, row: 0 },  // Left
    { col: 0, row: 1 },   // Up
    { col: 0, row: -1 }   // Down
  ];
  return generateMoves(colIdx, rowIdx, directions, activePieceColor, piecesPlacement);
};


const getDiagonalMoves = (colIdx, rowIdx, activePieceColor, piecesPlacement) => {
  const directions = [
    { col: 1, row: 1 },    // Top-right
    { col: -1, row: 1 },   // Top-left
    { col: 1, row: -1 },   // Bottom-right
    { col: -1, row: -1 }   // Bottom-left
  ];
  return generateMoves(colIdx, rowIdx, directions, activePieceColor, piecesPlacement);
};

// Pawn move function
const getPawnMoves = (activePiece, activePieceColor, piecesPlacement) => {
  const [colIdx, rowIdx] = getRowColIndex(activePiece);
  const moves = {};

  const direction = activePieceColor === "l" ? -1 : 1;
  const forwardMove = `${BOARDCOLS[colIdx]}${BOARDROWS[rowIdx + direction]}`;
  const twoForwardMove = `${BOARDCOLS[colIdx]}${BOARDROWS[rowIdx + (2 * direction)]}`;

  if (isEmptySquare(forwardMove, piecesPlacement)) moves[forwardMove] = false;
  if (rowIdx === (activePieceColor === "d" ? 1 : 6) && isEmptySquare(twoForwardMove, piecesPlacement)) {
    moves[twoForwardMove] = false;
  }

  const captureLeft = `${BOARDCOLS[colIdx - 1]}${BOARDROWS[rowIdx + direction]}`;
  const captureRight = `${BOARDCOLS[colIdx + 1]}${BOARDROWS[rowIdx + direction]}`;

  if (captureLeft && piecesPlacement[captureLeft]?.startsWith(activePieceColor === "l" ? "d" : "l")) {
    moves[captureLeft] = piecesPlacement[captureLeft];
  }
  if (captureRight && piecesPlacement[captureRight]?.startsWith(activePieceColor === "l" ? "d" : "l")) {
    moves[captureRight] = piecesPlacement[captureRight];
  }

  return moves;
};

// King move function
const getKingMoves = (activePiece, activePieceColor, piecesPlacement) => {
  const [colIdx, rowIdx] = getRowColIndex(activePiece);
  const moveDirections = [
    { col: 0, row: 1 },   // Up
    { col: 0, row: -1 },  // Down
    { col: 1, row: 0 },   // Right
    { col: -1, row: 0 },  // Left
    { col: 1, row: 1 },   // Top-right
    { col: -1, row: 1 },  // Top-left
    { col: 1, row: -1 },  // Bottom-right
    { col: -1, row: -1 }  // Bottom-left
  ];

  return generateMoves(colIdx, rowIdx, moveDirections, activePieceColor, piecesPlacement, true);
};

const getQueenMoves = (activePiece, activePieceColor, piecesPlacement) => {
  const [colIdx, rowIdx] = getRowColIndex(activePiece);

  const horizontalVerticalMoves = getHorizontalVerticalMoves(colIdx, rowIdx, activePieceColor, piecesPlacement);
  const diagonalMoves = getDiagonalMoves(colIdx, rowIdx, activePieceColor, piecesPlacement);

  return { ...horizontalVerticalMoves, ...diagonalMoves };
};

const getBishopMoves = (activePiece, activePieceColor, piecesPlacement) => {
  const [colIdx, rowIdx] = getRowColIndex(activePiece);
  return getDiagonalMoves(colIdx, rowIdx, activePieceColor, piecesPlacement);
};

const getRookMoves = (activePiece, activePieceColor, piecesPlacement) => {
  const [colIdx, rowIdx] = getRowColIndex(activePiece);
  return getHorizontalVerticalMoves(colIdx, rowIdx, activePieceColor, piecesPlacement);
};

const getKnightMoves = (activePiece, activePieceColor, piecesPlacement) => {
  const [colIdx, rowIdx] = getRowColIndex(activePiece);

  const directions = [
    { col: 2, row: 1 },   
    { col: -2, row: -1 },  
    { col: -2, row: 1 },   
    { col: 2, row: -1 },  
    { col: 1, row: 2 },   
    { col: -1, row: -2 },  
    { col: -1, row: 2 },   
    { col: 1, row: -2 },  

  ];
  return generateMoves(colIdx, rowIdx, directions, activePieceColor, piecesPlacement, true);
}

export const getPossibleMoves = (activePiece, piecesPlacement) => {
  const pieceInfo = piecesPlacement[activePiece];
  if (!pieceInfo) return [];

  const [activePieceColor, activePieceType] = pieceInfo.split("-");
  let possibleMoves = {};

  switch (activePieceType) {
    case "pawn":
      possibleMoves = getPawnMoves(activePiece, activePieceColor, piecesPlacement);
      break;
    case "king":
      possibleMoves = getKingMoves(activePiece, activePieceColor, piecesPlacement);
      break;
    case "queen":
      possibleMoves = getQueenMoves(activePiece, activePieceColor, piecesPlacement);
      break;
    case "bishop":
      possibleMoves = getBishopMoves(activePiece, activePieceColor, piecesPlacement);
      break;
    case "rook":
      possibleMoves = getRookMoves(activePiece, activePieceColor, piecesPlacement);
      break;
    case "knight":
      possibleMoves = getKnightMoves(activePiece, activePieceColor, piecesPlacement);
      break;
    default:
      break;
  }

  return possibleMoves;
};
