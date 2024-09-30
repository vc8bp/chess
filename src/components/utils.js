export const move = (to, possibleMoves) => {
  console.log({to, possibleMoves})
  if(!Object.keys(possibleMoves).includes(to)) return false // move is illegal
  return true
};
