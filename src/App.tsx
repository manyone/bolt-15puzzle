import React, { useState, useEffect } from 'react';
import { Shuffle } from 'lucide-react';

const BOARD_SIZE = 4;
const TOTAL_TILES = BOARD_SIZE * BOARD_SIZE;

type Tile = number | null;

function App() {
  const [board, setBoard] = useState<Tile[]>([]);

  useEffect(() => {
    initializeBoard();
  }, []);

  const initializeBoard = () => {
    const newBoard: Tile[] = Array.from({ length: TOTAL_TILES - 1 }, (_, i) => i + 1);
    newBoard.push(null);
    setBoard(shuffleBoard(newBoard));
  };

  const shuffleBoard = (board: Tile[]): Tile[] => {
    let newBoard = [...board];
    let isSolved = true;

    while (isSolved) {
      newBoard = [...board];
      const moves = 1000; // Number of random moves to perform
      let emptyIndex = newBoard.indexOf(null);

      for (let i = 0; i < moves; i++) {
        const possibleMoves = getAdjacentIndices(emptyIndex);
        const randomMoveIndex = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        [newBoard[emptyIndex], newBoard[randomMoveIndex]] = [newBoard[randomMoveIndex], newBoard[emptyIndex]];
        emptyIndex = randomMoveIndex;
      }

      isSolved = checkIfSolved(newBoard);
    }

    return newBoard;
  };

  const getAdjacentIndices = (index: number): number[] => {
    const row = Math.floor(index / BOARD_SIZE);
    const col = index % BOARD_SIZE;
    const adjacent: number[] = [];

    if (row > 0) adjacent.push(index - BOARD_SIZE); // Up
    if (row < BOARD_SIZE - 1) adjacent.push(index + BOARD_SIZE); // Down
    if (col > 0) adjacent.push(index - 1); // Left
    if (col < BOARD_SIZE - 1) adjacent.push(index + 1); // Right

    return adjacent;
  };

  const moveTile = (index: number) => {
    const emptyIndex = board.indexOf(null);
    if (isAdjacent(index, emptyIndex)) {
      const newBoard = [...board];
      [newBoard[index], newBoard[emptyIndex]] = [newBoard[emptyIndex], newBoard[index]];
      setBoard(newBoard);
    }
  };

  const isAdjacent = (index1: number, index2: number) => {
    const row1 = Math.floor(index1 / BOARD_SIZE);
    const col1 = index1 % BOARD_SIZE;
    const row2 = Math.floor(index2 / BOARD_SIZE);
    const col2 = index2 % BOARD_SIZE;
    return Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;
  };

  const checkIfSolved = (board: Tile[]): boolean => {
    for (let i = 0; i < TOTAL_TILES - 1; i++) {
      if (board[i] !== i + 1) return false;
    }
    return board[TOTAL_TILES - 1] === null;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Sliding Tile Puzzle</h1>
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
        <div className="grid grid-cols-4 gap-2 mb-4">
          {board.map((tile, index) => (
            <button
              key={index}
              className={`aspect-square w-full flex items-center justify-center text-xl font-bold rounded ${
                tile ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => moveTile(index)}
              disabled={tile === null}
            >
              {tile}
            </button>
          ))}
        </div>
        <button
          className="w-full bg-green-500 text-white py-2 rounded flex items-center justify-center"
          onClick={initializeBoard}
        >
          <Shuffle className="mr-2" /> Shuffle
        </button>
      </div>
      {checkIfSolved(board) && (
        <div className="mt-4 text-green-600 font-bold text-xl">Congratulations! You solved the puzzle!</div>
      )}
    </div>
  );
}

export default App;