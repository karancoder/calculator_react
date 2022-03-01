/* eslint-disable default-case */
import { useReducer } from "react";
import DigitButton from "./Components/DigitButton";
import OperationButton from "./Components/OperationButton";
import "./styles.css";

const INT_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})
function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INT_FORMATTER.format(integer)
  return `${INT_FORMATTER.format(integer)}.${decimal}`
}

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  DELETE_DIGIT: "delete-digit",
  CLEAR: "clear",
  EVALUATE: "evaluate",
  CHOOSE_OPERATION: "choose-operation",
};

function evaluate({ currOperand, prevOperand, operation }) {
  const curr = parseFloat(currOperand);
  const prev = parseFloat(prevOperand);
  if (isNaN(curr) || isNaN(prev)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + curr;
      break;
    case "-":
      computation = prev - curr;
      break;
    case "*":
      computation = prev * curr;
      break;
    case "/":
      computation = prev / curr;
      break;
  }
  return computation.toString();
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      console.log(state.overwrite)
      if (state.overwrite === true)
        return {
          ...state,
          overwrite: false,
          currOperand: payload.digit,
        }
      if (payload.digit === "0" && state.currOperand === "0") return state;
      if (payload.digit === "." && state.currOperand.includes("."))
        return state
      if (state.currOperand === "0") 
        return {
          ...state, 
          currOperand: payload.digit
        }
      return {
        ...state,
        currOperand: `${state.currOperand || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currOperand == null && state.prevOperand == null) {
        return state;
      }
      if (state.prevOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          prevOperand: state.currOperand,
          currOperand: null,
        };
      }
      if (state.currOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      return {
        ...state,
        operation: payload.operation,
        prevOperand: evaluate(state),
        currOperand: null,
      };
    case ACTIONS.EVALUATE:
      if (state.prevOperand == null) {
        return state;
      }
      if (state.currOperand == null) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        currOperand: evaluate(state),
        prevOperand: null,
        operation: null,
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currOperand: "0",
        }
      }
      if (state.currOperand == null) return state
      if (state.currOperand.length === 1) {
        return {
          ...state,
          currOperand: "0",
        }
      }
      return {
        ...state,
        currOperand: state.currOperand.slice(0, -1),
      }
  }
}

function App() {
  const [{ currOperand, prevOperand, operation }, dispatch] = useReducer(
    reducer,
    { currOperand: "0" }
  );

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="prev-operand">
          {formatOperand(prevOperand)} {operation}
        </div>
        <div className="curr-operand">{formatOperand(currOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() =>dispatch({ type: ACTIONS.DELETE_DIGIT })}>Del</button>
      <OperationButton operation="/" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}

export default App;
