import { useState } from "react";
import { BaristaContext } from "./BaristaContext";
import BrewinEditor from "./components/BrewinEditor";

function App() {
  const [baristaMode, setBaristaMode] = useState(false);

  const Header = () => (
    <header>
      <h1 className="text-3xl">
        <span className="font-bold">☕ barista</span> | brewin as a service
      </h1>
      <hr className="my-2" />
    </header>
  );

  const Footer = () => (
    <footer className="mb-2">
      <hr className="my-1" />
      <p className="text-xs">
        made by{" "}
        <a className="underline" href="https://matthewwang.me">
          matt
        </a>{" "}
        for{" "}
        <a className="underline" href="https://github.com/UCLA-CS-131">
          CS 131
        </a>
        ; on{" "}
        <a className="underline" href="https://github.com/UCLA-CS-131/barista">
          github
        </a>
        .{" "}
        <button
          className="underline"
          onClick={() => setBaristaMode(!baristaMode)}
        >
          barista mode.
        </button>
      </p>
    </footer>
  );

  return (
    <BaristaContext.Provider value={baristaMode}>
      <div className="App">
        <main className="main-container mt-2">
          <div></div> {/* empty div for grid */}
          <Header />
          <BrewinEditor />
          <Footer />
        </main>
      </div>
    </BaristaContext.Provider>
  );
}

export default App;
