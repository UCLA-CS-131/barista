export const S23_VERSIONS = [
  {
    version: "1",
    quarter: "s23",
    title: "brewin",
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
  // { version: "3", title: "brewin#" },
];
