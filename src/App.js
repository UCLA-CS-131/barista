import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';

const DEFAULT_PROGRAM =
`func main
 assign v1 20
 funccall print v1
endfunc`;

const ENDPOINT = process.env.NODE_ENV === 'development' ? 'http://localhost:8000/f22' : '/f22'

function App() {
  const [program, setProgram] = useState(DEFAULT_PROGRAM);
  const [version, setVersion] = useState('1');
  const [output, setOutput] = useState('')

  function runProgram() {
    fetch(ENDPOINT, {
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
      <div className="container">
        <h1 className='inline'>☕ barista</h1>
        &nbsp;
        <p className='inline'>| brewin as a service</p>
        <hr />
        <select className="btn btn-blue-outline mr-0-5" style={{paddingLeft: '0.25rem'}} value={version} onChange={(e) => setVersion(e.target.value)}>
          <option value="1">fall 2022</option>
        </select>
        <select className="btn btn-blue-outline mr-0-5" style={{paddingLeft: '0.25rem'}} value={version} onChange={(e) => setVersion(e.target.value)}>
          <option value="1">1: brewin</option>
          <option value="2">2: brewin++</option>
          <option value="3">3: brewin#</option>
        </select>
        <button className="btn btn-blue" onClick={runProgram}>run</button>

        <h2>your code</h2>
        <Editor
          className='editor'
          value={program}
          onValueChange={program => setProgram(program)}
          highlight={code => code /* this is an identity -- no highlighting */}
          padding={10}
        />

        <h2>our output</h2>
        <Editor
          className='editor'
          value={output}
          highlight={code => code /* this is an identity -- no highlighting */}
          padding={10}
          readOnly={true}
        />
      </div>
    </div>
  );
}

export default App;
