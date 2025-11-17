"use client";

import { useAppDispatch, useAppSelector } from "@/store/storeHooks";
import {
  increment,
  decrement,
  addAmount,
} from "@/store/slices/counter/counterSlice";
import { useState } from "react";

export function Counter() {
  const dispatch = useAppDispatch();
  const value = useAppSelector((state) => state.counter.value);
  const [amount, setAmount] = useState(0);

  return (
    <div className="flex items-center space-x-2">
      <button
        className="px-3 py-1 rounded bg-primary text-primary-foreground"
        onClick={() => dispatch(decrement())}
      >
        -
      </button>
      <span className="px-3">{value}</span>
      <button
        className="px-3 py-1 rounded bg-primary text-primary-foreground"
        onClick={() => dispatch(increment())}
      >
        +
      </button>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="w-20 ml-2 p-1 border"
      />
      <button
        className="px-3 py-1 rounded bg-secondary text-secondary-foreground"
        onClick={() => dispatch(addAmount(amount))}
      >
        Add
      </button>
    </div>
  );
}
