export const piceImageMap = {
    "d-rook": "/pieces/rook-b.svg",
    "l-rook": "/pieces/rook-w.svg",
    "d-bishop": "/pieces/bishop-b.svg",
    "l-bishop": "/pieces/bishop-w.svg",
    "d-king": "/pieces/king-b.svg",
    "l-king": "/pieces/king-w.svg",
    "d-knight": "/pieces/knight-b.svg",
    "l-knight": "/pieces/knight-w.svg",
    "d-pawn": "/pieces/pawn-b.svg",
    "l-pawn": "/pieces/pawn-w.svg",
    "d-queen": "/pieces/queen-b.svg",
    "l-queen": "/pieces/queen-w.svg"
  };
  
export const defaultPlacement = {
    "A8": "d-rook", "H8": "d-rook",
    "A1": "l-rook", "H1": "l-rook",
  
    "B8": "d-knight", "G8": "d-knight",
    "B1": "l-knight", "G1": "l-knight",
  
    "C8": "d-bishop", "F8": "d-bishop",
    "C1": "l-bishop", "F1": "l-bishop",
  
    "D8": "d-queen",
    "D1": "l-queen",
  
    "E8": "d-king",
    "E1": "l-king",
  
    "A7": "d-pawn", "B7": "d-pawn", "C7": "d-pawn", "D7": "d-pawn",
    "E7": "d-pawn", "F7": "d-pawn", "G7": "d-pawn", "H7": "d-pawn",
  
    "A2": "l-pawn", "B2": "l-pawn", "C2": "l-pawn", "D2": "l-pawn",
    "E2": "l-pawn", "F2": "l-pawn", "G2": "l-pawn", "H2": "l-pawn"
  };
  

export const BOARDROWS = [8, 7, 6, 5, 4, 3, 2, 1];
export const BOARDCOLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];