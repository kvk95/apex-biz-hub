import { useState } from "react";

interface CalculatorProps {
  onClose: () => void;
}

function calculate(first: number, second: number, op: string): number {
  switch (op) {
    case "+":
      return first + second;
    case "-":
      return first - second;
    case "×":
      return first * second;
    case "÷":
      return second !== 0 ? first / second : NaN; // prevent divide by zero
    default:
      return second;
  }
}

export function Calculator({ onClose }: CalculatorProps) {
  const [display, setDisplay] = useState("0");
  const [previous, setPrevious] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay((prev) => (prev === "0" ? digit : prev + digit));
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay((prev) => prev + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setPrevious(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const toggleSign = () => {
    setDisplay((prev) => {
      if (prev === "0") return "0";
      return prev.startsWith("-") ? prev.slice(1) : "-" + prev;
    });
  };

  const inputPercent = () => {
    const num = parseFloat(display) / 100;
    setDisplay(num.toString().replace(/\.?0+$/, ""));
  };

  const backspace = () => {
    setDisplay((prev) => {
      if (prev.length > 1) {
        return prev.slice(0, -1);
      }
      return "0";
    });
  };

  const inputOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (previous === null) {
      setPrevious(inputValue);
    } else if (operator) {
      const current = previous || 0;
      const newValue = calculate(current, inputValue, operator);
      setDisplay(newValue.toString().replace(/\.?0+$/, ""));
      setPrevious(newValue);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const equals = () => {
    const inputValue = parseFloat(display);

    if (previous !== null && operator) {
      const newValue = calculate(previous, inputValue, operator);
      setDisplay(
        isNaN(newValue) ? "Error" : newValue.toString().replace(/\.?0+$/, "")
      );
      setPrevious(null);
      setOperator(null);
      setWaitingForOperand(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative w-80 rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
          <h3 className="text-lg font-semibold text-gray-800">Calculator</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 focus:outline-none"
          >
            ×
          </button>
        </div>

        <div className="mb-6 flex min-h-[3rem] items-end justify-end rounded-xl bg-gray-100 p-3 text-3xl font-mono text-gray-900">
          {display}
        </div>

        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={clear}
            className="rounded-lg bg-orange-500 p-3 font-bold text-white hover:bg-orange-600"
          >
            C
          </button>
          <button
            onClick={toggleSign}
            className="rounded-lg bg-gray-300 p-3 font-bold text-gray-800 hover:bg-gray-400"
          >
            ±
          </button>
          <button
            onClick={inputPercent}
            className="rounded-lg bg-gray-300 p-3 font-bold text-gray-800 hover:bg-gray-400"
          >
            %
          </button>
          <button
            onClick={() => inputOperator("÷")}
            className="rounded-lg bg-gray-300 p-3 font-bold text-gray-800 hover:bg-gray-400"
          >
            ÷
          </button>

          <button
            onClick={() => inputDigit("7")}
            className="rounded-lg border border-gray-300 bg-white p-3 font-bold text-gray-800 hover:bg-gray-50"
          >
            7
          </button>
          <button
            onClick={() => inputDigit("8")}
            className="rounded-lg border border-gray-300 bg-white p-3 font-bold text-gray-800 hover:bg-gray-50"
          >
            8
          </button>
          <button
            onClick={() => inputDigit("9")}
            className="rounded-lg border border-gray-300 bg-white p-3 font-bold text-gray-800 hover:bg-gray-50"
          >
            9
          </button>
          <button
            onClick={() => inputOperator("×")}
            className="rounded-lg bg-gray-300 p-3 font-bold text-gray-800 hover:bg-gray-400"
          >
            ×
          </button>

          <button
            onClick={() => inputDigit("4")}
            className="rounded-lg border border-gray-300 bg-white p-3 font-bold text-gray-800 hover:bg-gray-50"
          >
            4
          </button>
          <button
            onClick={() => inputDigit("5")}
            className="rounded-lg border border-gray-300 bg-white p-3 font-bold text-gray-800 hover:bg-gray-50"
          >
            5
          </button>
          <button
            onClick={() => inputDigit("6")}
            className="rounded-lg border border-gray-300 bg-white p-3 font-bold text-gray-800 hover:bg-gray-50"
          >
            6
          </button>
          <button
            onClick={() => inputOperator("-")}
            className="rounded-lg bg-gray-300 p-3 font-bold text-gray-800 hover:bg-gray-400"
          >
            −
          </button>

          <button
            onClick={() => inputDigit("1")}
            className="rounded-lg border border-gray-300 bg-white p-3 font-bold text-gray-800 hover:bg-gray-50"
          >
            1
          </button>
          <button
            onClick={() => inputDigit("2")}
            className="rounded-lg border border-gray-300 bg-white p-3 font-bold text-gray-800 hover:bg-gray-50"
          >
            2
          </button>
          <button
            onClick={() => inputDigit("3")}
            className="rounded-lg border border-gray-300 bg-white p-3 font-bold text-gray-800 hover:bg-gray-50"
          >
            3
          </button>
          <button
            onClick={() => inputOperator("+")}
            className="rounded-lg bg-gray-300 p-3 font-bold text-gray-800 hover:bg-gray-400"
          >
            +
          </button>

          <button
            onClick={inputDecimal}
            className="rounded-lg border border-gray-300 bg-white p-3 font-bold text-gray-800 hover:bg-gray-50"
          >
            .
          </button>
          <button
            onClick={() => inputDigit("0")}
            className="col-span-2 rounded-lg border border-gray-300 bg-white p-3 font-bold text-gray-800 hover:bg-gray-50"
          >
            00
          </button>
          <button
            onClick={equals}
            className="rounded-lg bg-orange-500 p-3 font-bold text-white hover:bg-orange-600"
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
}
