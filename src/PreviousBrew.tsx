import { LoadProgram, RunResponse } from './types';

type Props = {
  response: RunResponse,
  loadProgram: LoadProgram
}

export default function PreviousBrew({response, loadProgram}: Props) {
  const { program, output, version, iteration } = response;
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
