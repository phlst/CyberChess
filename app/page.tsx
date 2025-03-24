"use client";
import Board from "./components/board/Board";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { useEffect } from "react";
import { initCheckStatus } from "./store/gameState/gameState";

export default function Home() {
  useEffect(() => {
    store.dispatch(initCheckStatus());
  }, []);

  return (
    <Provider store={store}>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-800">
        <h1 className="text-3xl font-bold text-white mb-8">CyberChess</h1>
        <Board />
      </main>
    </Provider>
  );
}
