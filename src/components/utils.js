import { getPossibleMoves } from "./possibleMoves"

export const calculateAllMoves = (color, piecesPlacement) => {
    const moves = {}
    let checkData = false
    Object.keys(piecesPlacement).forEach(cell => {
      if(piecesPlacement[cell]){
        const [pieceColor] = piecesPlacement[cell]
        if(color == pieceColor) {
          moves[cell] = getPossibleMoves(cell, piecesPlacement)

          if(!checkData){ //checking if any of the move includes check to opponent
            Object.keys(moves[cell]).some(moveCell => {
              if(typeof piecesPlacement[moveCell] == "string") { //is capture Move
                const isKing = piecesPlacement[moveCell].includes("king")
                if(isKing) {
                  checkData = {
                    kingPosition: moveCell, 
                    kingColor: color == "d" ? "l" : "d",
                    checkFromCell: cell
                  }
                  return true
                }
              }
            })
          }
        }
      }
    })
    return {moves, isCkecking: checkData}
   }


export const isKingInCheck = (kingColor, piecesPlacement) => {
    // Loop through all pieces and check if any of the opponent's moves target the king's position
    const opponentColor = kingColor === "d" ? "l" : "d";
    const opponentMoves = calculateAllMoves(opponentColor, piecesPlacement).moves;
    
    // Find the king's position
    let kingPosition = "";
    Object.keys(piecesPlacement).forEach(cell => {
      if(piecesPlacement[cell] && piecesPlacement[cell].includes(`${kingColor}-king`)) {
        kingPosition = cell;
      }
    });
    
    // Check if any of the opponent's moves can capture the king
    let isInCheck = false;
    Object.keys(opponentMoves).some(cell => {
      if (opponentMoves[cell] && opponentMoves[cell][kingPosition] !== undefined) {
        isInCheck = true;
        return true;
      }
    });
    
    return isInCheck;
  };
  
  export const calculateCheckmate = (preCalculatedData, opponentData, piecesPlacement) => {
    if (!preCalculatedData.isCkecking) return { isCheckmate: false }; 
    
    console.log("Calculating Checkmate");
    console.log(preCalculatedData.isCkecking);
    
    const { kingColor } = preCalculatedData.isCkecking;
    const playerMoves = opponentData.moves;
    
    let possibleMovesToAvoidCheck = {}; 
    
    console.log({playerMoves});
    for (const fromCell in playerMoves) {
      const moves = getPossibleMoves(fromCell, piecesPlacement);
  
      for (const toCell in moves) {
        // Simulate the move
        const newPiecesPlacement = { ...piecesPlacement };
        newPiecesPlacement[toCell] = newPiecesPlacement[fromCell];
        delete newPiecesPlacement[fromCell];
  
        // If this move results in the king not being in check
        if (!isKingInCheck(kingColor, newPiecesPlacement)) {
            console.log({[toCell]: newPiecesPlacement[toCell]})
          possibleMovesToAvoidCheck[fromCell] = { [toCell] : piecesPlacement[toCell] ? true : false} ;
        }
      }
    }
  
    if (Object.keys(possibleMovesToAvoidCheck).length === 0) { //if no possible move found it's checkmate
      return null; 
    }
  
    return { isCheckmate: false, possibleMoves: possibleMovesToAvoidCheck };
  };
  