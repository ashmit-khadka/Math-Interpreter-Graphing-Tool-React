# Interpreter
Maths Interpreter 

Has three main uses:
1) Root of polynomial
2) Parse statement and/or expression
3) Parase and execute statement and/or expression

Needs to be ran using command line arguements for each different use:
1) "rootofpoly" "['i','j','k','m']" - Command is arg[0] and list of doubles is arg[1]
2) "parse" "['-5+x']" - Command is arg[0] and list of expressions/statements is arg[1]
3) "expression" "['x=2','y=200','-x+3y']" - Command is arg[0] and list of expressions/statements is arg[1]

If an error occurs from any of the expressions/statements it will return a error early. Otherwise parse will return one true for all statements/expressions. Expression will also only return the result from the final expression/statement. All outputs are written to console and are serialized as json.

The Interpreter itself can handle doubles, integers, variables, addition, subtraction, mutiplication, division and exponents.
