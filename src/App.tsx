import { useEffect, useState } from "react";
import "./App.css";
import { QuestionInput } from "./components/Input";
import {
  checkSolved,
  generateTable,
  validatePlacement,
} from "./util/generateTable";
import Toast from "./components/Toast";
import { isNumeric } from "./util";
import { Modal } from "./components/CustomModal";

function App() {
  const [{ questionTable }, setTable] = useState(generateTable());
  const [isSolved, setIsSolved] = useState(false);
  const [numberOfMoves, setNumberOfMoves] = useState(0);
  const [invalidBoxes, setInvalidBoxes] = useState<
    {
      i: number;
      j: number;
    }[]
  >([]);
  const [error, setError] = useState("");
  const [inputValues, setInputValues] = useState([
    ...questionTable.map((row) => [...row]),
  ]);
  const [helpModal, setHelpModal] = useState(false);

  const handleChange = (i: number, j: number) => (value: string) => {
    if (!isNumeric(value) && value !== "") {
      setError("Please enter a number");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    setInputValues((old) => {
      const newInputValues = [...old];
      newInputValues[i][j] = Number(value);
      return newInputValues;
    });
    if (Number(value) < 0 || Number(value) > 9) {
      setError("Please enter a number between 0 and 9");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }
    const isValid = validatePlacement([...questionTable], i, j, Number(value));
    if (!isValid) {
      setInvalidBoxes((old) => [...old, { i, j }]);
    } else {
      setInvalidBoxes((old) => old.filter((box) => box.i !== i || box.j !== j));
    }
    setNumberOfMoves((move) => move + 1);
  };

  const newGame = () => {
    const table = generateTable();
    setTable(table);
    setInputValues([...table.questionTable]);
    setIsSolved(false);
    setInvalidBoxes([]);
    setNumberOfMoves(0);
  };

  useEffect(() => {
    setIsSolved(checkSolved(inputValues));
  }, [inputValues]);
  console.log(isSolved, questionTable);
  return (
    <div className="container">
      <h1>Sudoku Game Puzzle</h1>
      <h3>
        The green cells are the correct answers. the red cells are the wrong
        answers. the no color cells are the not sure answers. Range from 1 to 9{" "}
        <button onClick={() => setHelpModal(true)}>How to play</button>
      </h3>
      <h4>
        Move: {numberOfMoves}{" "}
        <button onClick={newGame}>give up for new game?</button>
      </h4>
      <Toast message={error}></Toast>
      <Modal onClose={() => setIsSolved(false)} open={isSolved}>
        <h2 style={{ color: "green", textAlign: "center" }}>
          Congratulations! You solved the puzzle.
        </h2>
        <p style={{ textAlign: "center" }}>Number of moves: {numberOfMoves}</p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={newGame} style={{ padding: "10px 20px" }}>
            Reset game
          </button>
        </div>
      </Modal>
      <Modal onClose={() => setHelpModal(false)} open={helpModal}>
        <h2 style={{ color: "green", textAlign: "center" }}>How to play</h2>
        <p style={{ textAlign: "center" }}>
          Enter the number in the cell to make the sum of each row equal to the
          sum of that row (correct sum is in the right of that row) and the sum
          of each column equal to the sum of that column (correct sum is in the
          top of that column)
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            onClick={() => setHelpModal(false)}
            style={{ padding: "10px 20px" }}
          >
            Close
          </button>
        </div>
      </Modal>
      <table>
        <thead>
          <tr></tr>
        </thead>
        <tbody>
          {questionTable.slice().map((row, i) => (
            <tr key={i}>
              {row.map((_, j) => (
                <td
                  key={j}
                  className={`${[2, 5, 8].includes(j) ? "border-right" : ""} ${
                    [2, 5, 8].includes(i) ? "border-bottom" : ""
                  } ${[0, 3, 6].includes(j) ? "border-left" : ""} ${
                    [0, 3, 6].includes(i) ? "border-top" : ""
                  }`}
                >
                  <QuestionInput
                    value={String(inputValues[i][j])}
                    correct={
                      invalidBoxes.find((box) => box.i === i && box.j === j)
                        ? "wrong"
                        : inputValues[i][j] !== 0
                        ? "correct"
                        : "normal"
                    }
                    onChange={handleChange(i, j)}
                    blocked={questionTable[i][j] !== 0}
                  ></QuestionInput>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <footer>Make by 💕 and 💪</footer>
    </div>
  );
}

export default App;
