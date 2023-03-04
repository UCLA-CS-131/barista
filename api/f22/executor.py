from . import interpreterv1
from . import interpreterv2
from . import interpreterv3

def process_input(input):
  return input.split('\n')

def run(version, raw_program):
  match version:
    case "1":
      interpreter = interpreterv1
    case "2":
      interpreter = interpreterv2
    case "3":
      interpreter = interpreterv3
    case _:
      raise 'error'

  program = process_input(raw_program)

  instance = interpreter.Interpreter(False, program, False)
  instance.validate_program(program)
  instance.run(program)
  return instance.get_output()
