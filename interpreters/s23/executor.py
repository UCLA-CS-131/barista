from . import interpreterv1
from . import interpreterv2
from . import interpreterv3


def run(version, raw_program, stdin=None):
    match version:
        case "1":
            interpreter = interpreterv1
        case "2":
            interpreter = interpreterv2
        case "3":
            interpreter = interpreterv3
        case _:
            raise ValueError("Invalid version; expected one of {1,2,3}")

    program = raw_program.split("\n")

    instance = interpreter.Interpreter(False, stdin.split(), False)
    instance.validate_program(program)
    instance.run(program)
    return instance.get_output()
