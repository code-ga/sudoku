import { generate, validate } from "./sudoku";

export function generateTable() {
  const questionTable = generate(40);

  return {
    questionTable: questionTable as number[][],
  };
}

export function checkSolved(
  questionTable: number[][],
) {
  return questionTable.every((row) => row.every((cell) => cell !== 0)) && validate(questionTable);
}

export {validatePlacement} from "./sudoku"