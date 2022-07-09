import React, { useState } from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { trpc } from "./trpc";

import "./index.scss";

const client = new QueryClient();

const AppContent = () => {
  const [code, setCode] = useState("");
  // const [positions, setPositions] = useState({startPos: 0});

  const refactorSwitch = trpc.useMutation("switch");

  const onRefactorSwitch = () => {
    refactorSwitch.mutate(
      {
        code,
        positions: {}
      },
      {
        onSuccess: () => {
          console.log("refactored switch:", code)
          setCode(code)
        },
      }
    );
  };


  return (
    <div className="mt-10 text-3xl mx-auto max-w-6xl">
      <div className="mt-10">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="p-5 border-2 border-gray-300 rounded-lg w-full"
          placeholder="User"
        />
      </div>

      <button onClick={onRefactorSwitch}>Refactor</button>
    </div>
  );
};

const App = () => {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      url: "http://localhost:8080/trpc",
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={client}>
      <QueryClientProvider client={client}>
        <AppContent />
      </QueryClientProvider>
    </trpc.Provider>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
