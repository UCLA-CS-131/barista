import React, { useState } from 'react';
import './App.css';

function App() {
  const [program, setProgram] = useState('');
  const [version, setVersion] = useState('1');
  const [output, setOutput] = useState('')

  function runProgram() {
    fetch('http://localhost:8000/f22', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        program,
        version,
      }),
    }).then(res => res.json()).then(data => {
      setOutput(data.res)
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <textarea value={program} onChange={(e) => setProgram(e.target.value)} />
        <select value={version} onChange={(e) => setVersion(e.target.value)}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        <button onClick={runProgram}>send</button>
        {output}
      </header>
    </div>
  );
}

export default App;
