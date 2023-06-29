const par = "(\\()";
const symbol = /(?!\d)[-+*/~!@$%^=<>{}\w]+/.source;
const space = "(?=\\s)";
const optionalSpace = "\\s*";

function primitive(pattern: string) {
  return RegExp(/([\s([])/.source + "(?:" + pattern + ")" + /(?=[\s)])/.source);
}

const brewinV1 = {
  comment: /#.*/,
  string: {
    pattern: /"(?:[^"\\]|\\.)*"/,
    greedy: true,
    inside: {
      argument: /[-A-Z]+(?=[.,\s])/,
      symbol: RegExp("`" + symbol + "'"),
    },
  },
  keyword: [
    {
      pattern: RegExp(
        par +
          optionalSpace +
          "(?:and|(?:cl-)?if|while|(?:lexical-)?let\\*?|while\
          )" +
          space
      ),
      lookbehind: true,
    },
    {
      pattern: RegExp(par + optionalSpace + "(?:begin|set|print|call)" + space),
      lookbehind: true,
    },
    {
      pattern: primitive(/return|inputi|inputs/.source),
      lookbehind: true,
    },
  ],
  class: {
    pattern: primitive(/class/.source),
    lookbehind: true,
    alias: "class-name",
  },
  boolean: {
    pattern: primitive(/false|true/.source),
    lookbehind: true,
  },
  classRefs: {
    pattern: primitive(/me/.source),
    lookbehind: true,
  },
  new: {
    pattern: primitive(/new/.source),
    lookbehind: true,
  },
  null: {
    pattern: primitive(/null/.source),
    lookbehind: true,
  },
  number: {
    pattern: primitive(/[-+]?\d+(?:\.\d*)?/.source),
    lookbehind: true,
  },
  classAttributes: {
    pattern: primitive(/method|field/.source),
    lookbehind: true,
  },
  punctuation: [
    // open paren, brackets, and close paren
    /(?:['`,]?\(|[)\[\]])/, //eslint-disable-line
  ],
};

const brewinV2 = {
  ...brewinV1,
  primitiveTypes: {
    pattern: primitive(/void|int|bool|string/.source),
    lookbehind: true,
  },
  classRefs: {
    pattern: primitive(/me|super/.source),
    lookbehind: true,
  },
};

const brewinV3 = {
  ...brewinV2,
  class: {
    pattern: primitive(/t?class/.source),
    lookbehind: true,
    alias: "class-name",
  },
  genericTypeConcatChar: {
    pattern: RegExp(/@/.source),
    lookbehind: true,
  },
  exceptionKeywords: {
    pattern: RegExp(par + "try|throw\\s+"),
    lookbehind: true,
  },
};

export const S23_VERSIONS = [
  {
    version: "1",
    quarter: "s23",
    title: "brewin",
    highlighter: brewinV1,
    defaultProgram: `(class person
  (field name "")
  (field age 0)
  (method init (n a)
    (begin (set name n) (set age a)))
  (method talk (to_whom)
    (print name " says hello to " to_whom)))

(class main
  (field p null)
  (method tell_joke (to_whom)
    (print "Hey " to_whom ", knock knock!"))
  (method main ()
    (begin
      (call me tell_joke "Matt") # call tell_joke in current object
      (set p (new person))  # allocate a new person obj, point p at it
      (call p init "Siddarth" 25) # call init in object pointed to by p
      (call p talk "Paul")       # call talk in object pointed to by p
)))`,
  },
  {
    version: "2",
    quarter: "s23",
    title: "brewin++",
    highlighter: brewinV2,
    defaultProgram: `(class main
    (method int value_or_zero ((int q))
      (begin
        (if (< q 0)
          (print "q is less than zero")
          (return q) # else case
        )
       )
    )
    (method void main ()
      (begin
        (print (call me value_or_zero 10))  # prints 10
        (print (call me value_or_zero -10)) # prints 0
      )
    )
  )`,
  },
  {
    version: "3",
    quarter: "s23",
    title: "brewin##",
    highlighter: brewinV3,
    defaultProgram: `(tclass node (field_type)
    (field node@field_type next null)
    (field field_type value)
    (method void set_val ((field_type v)) (set value v))
    (method field_type get_val () (return value))
    (method void set_next((node@field_type n)) (set next n))
    (method node@field_type get_next() (return next))
  )

  (class main
    (method void main ()
      (let ((node@int x null))
        (set x (new node@int))
        (call x set_val 5)
        (print (call x get_val))
      )
    )
  )`,
  },
];
