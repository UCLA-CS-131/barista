export default function PreviousBrew({program, output, version, iteration, loadProgram}) {
  return (
    <li className='single-run border-t py-2 text-ellipsis overflow-hidden whitespace-nowrap'>
      <span className='flex flex-row justify-between'>
        <span>brew #{iteration}</span>
        <button className="underline" onClick={() => loadProgram(program, output, version)}>load</button>
      </span>
      <span className="text-xs">
      code: <code>{program}</code>
      <br />
      out: <code>{output}</code>
      </span>
    </li>
  )
}
