using System.Collections;
using static Interpreter.Models.LookupTable;

namespace Interpreter.Models
{
	//This class parses the tokens from the LookupTable following the BNF 
	//rules below:
	/*	BNF
	*	<statement> ::= <variable> = <expression>
	*	<expression> ::= <term> <expression_prime>
	*	<expression_prime> ::= + <term> <expression_prime>
	*	<expression_prime> ::= - <term> <expression_prime>
	*	<term> ::= <factor> <term_prime>
	*	<term_prime> ::= ^ <factor> <term_prime>
	*	<term_prime> ::= * <factor> <term_prime>
	*	<term_prime> ::= / <factor> <term_prime>
	*	<factor> ::= number | <variable> | (<expr>)
	*   <variable> ::= id
	*/
	public class Parser
	{
		int LookAhead;
		int currentToken;
		string Return { get; set; }
		readonly LookupTable LT;
		readonly ParseTree trie;
		readonly bool isFromParseFunc;

		public Parser(ref LookupTable lt, bool isFromParseFunc)
		{
			this.LookAhead = -1;
			this.currentToken = 0;
			this.Return = "p";
			this.LT = lt;
			this.trie = new ParseTree();
			this.isFromParseFunc = isFromParseFunc;

		}

		//This is main function of the class
		public string Parse()
		{
			Statement(0);
			LT.SetParsedTrie(trie);
			return Return;
		}

		//This function checks to see if the token parsed and the token in 
		//the symbol table match 
		bool Match_Token(int token)
		{
			this.LookAhead = (int)LT.symbols[currentToken].Type;
			return (LookAhead.Equals(token));

		}

		//This sets the lookahead forward by one index allowing the program to see what comes next
		void Advance_LookAhead()
		{
			this.LookAhead = (int)LT.symbols[++currentToken].Type;
		}

		//This function is the statement BNF rule
		void Statement(int level)
		{
			//Checks to see if it is a statement with a variable assignment
			if (LT.GetSymbol(1).Type == Tokens.Equal)
			{
				trie.AddNewNode(level, Tokens.EMPTY, "<<Statement>>");
				if (!(Variable(level + 1, true)))
				{
					//returns an error if someone tries to assign a value to anything other than a variable
					Return = "Can't assign data to " + LT.symbols[currentToken].Type;
					return;
				}

				if (Match_Token((int)Tokens.Equal))
				{
					trie.AddNewNode(level + 1, "<<Statement>>", Tokens.Equal);
					Advance_LookAhead();
				}

				Expression(level + 1);
			}
			else
			{
				Expression(level);
			}
		}

		//This is the expression BNF rule
		void Expression(int level)
		{
			if (level == 1)
			{
				trie.AddNewNode(level, "<<Statement>>", "<<Expression>>");
			}
			else if (level == 0)
			{
				trie.AddNewNode(level, Tokens.EMPTY, "<<Expression>>");
			}
			else
			{
				trie.AddNewNode(level, "<<Factor>>", "<<Expression>>");
			}
			Term(level + 1, true);
			Expression_Prime(level + 1);
		}

		//This is the expression prime BNF rule 
		void Expression_Prime(int level)
		{
			//Checks if there is a plus token
			if (Match_Token((int)(Tokens.Plus)))
			{
				trie.AddNewNode(level, "<<Expression>>", "<<Expression_Prime>>");
				trie.AddNewNode(level + 1, "<<Expression_Prime>>", Tokens.Plus);
				Advance_LookAhead();
				Term(level + 1, false);
				Expression_Prime(level + 1);
			}
			//Checks for a minus token
			else if (Match_Token((int)(Tokens.Minus)))
			{
				trie.AddNewNode(level, "<<Expression>>", "<<Expression_Prime>>");
				trie.AddNewNode(level + 1, "<<Expression_Prime>>", Tokens.Minus);
				Advance_LookAhead();
				Term(level + 1, false);
				Expression_Prime(level + 1);
			}
		}

		//This is the term BNF rule
		void Term(int level, bool isCalledFromExp)
		{
			//This decides if the term node should be a child of exp or exp prime
			if (isCalledFromExp)
			{
				trie.AddNewNode(level, "<<Expression>>", "<<Term>>");
			}
			else
			{
				trie.AddNewNode(level, "<<Expression_Prime>>", "<<Term>>");
			}
			Factor(level + 1, true);
			Term_Prime(level + 1);
		}

		//This is the term prime BNF rule
		void Term_Prime(int level)
		{
			//Looks for a multiplication token
			if (Match_Token((int)(LookupTable.Tokens.Multiply)))
			{
				trie.AddNewNode(level, "<<Term>>", "<<Term_Prime>>");
				trie.AddNewNode(level + 1, "<<Term_Prime>>", Tokens.Multiply);
				Advance_LookAhead();
				Factor(level + 1, false);
				Term_Prime(level + 1);
			}
			//Looks for a division token
			else if (Match_Token((int)(LookupTable.Tokens.Divide)))
			{
				trie.AddNewNode(level, "<<Term>>", "<<Term_Prime>>");
				trie.AddNewNode(level + 1, "<<Term_Prime>>", Tokens.Divide);
				Advance_LookAhead();
				Factor(level + 1, false);
				Factor(level + 1, false);
				Term_Prime(level + 1);
			}
			//Checks for an exponent token
			else if (Match_Token((int)(LookupTable.Tokens.Exponent)))
			{
				trie.AddNewNode(level, "<<Term>>", "<<Term_Prime>>");
				trie.AddNewNode(level + 1, "<<Term_Prime>>", Tokens.Exponent);
				Advance_LookAhead();
				Factor(level + 1, false);
				Term_Prime(level + 1);
			}
		}

		//This is the factor BNF rule
		void Factor(int level, bool isCalledFromTerm)
		{
			//This decides if factor is a child node of term or term prime
			if (isCalledFromTerm)
			{
				trie.AddNewNode(level, "<<Term>>", "<<Factor>>");
			}
			else
			{
				trie.AddNewNode(level, "<<Term_Prime>>", "<<Factor>>");
			}
			//Checks for a Integer token
			if (Match_Token((int)LookupTable.Tokens.Integer))
			{
				trie.AddNewNode(level + 1, "<<Factor>>", LT.GetSymbol(currentToken).Value);
				Advance_LookAhead();
			}
			//Looks for a double token
			else if (Match_Token((int)LookupTable.Tokens.Double))
			{
				trie.AddNewNode(level + 1, "<<Factor>>", LT.GetSymbol(currentToken).Value);
				Advance_LookAhead();
			}
			//Checks if it's a variable token
			else if (Match_Token((int)LookupTable.Tokens.Variable))
			{
				Variable(level, false);
			}
			//Checks if it's a left parenthesis token 
			else if (Match_Token((int)LookupTable.Tokens.Left_Parenthesis))
			{
				Advance_LookAhead();
				Expression(level + 1);
				//Checks if it is a right parenthesis token
				if (Match_Token((int)LookupTable.Tokens.Right_Parenthesis))
				{
					Advance_LookAhead();
				}
				else Return = "Missing closing parenthesis";
				return;
			}
			//else ret = "Missing factor";
			return;
		}

		//This is the variable BNF rule
		bool Variable(int level, bool isStatement)
		{
			//This checks if the token is a variable
			if (Match_Token((int)LookupTable.Tokens.Variable))
			{
				//this checks if its from a statement as it will be used to assign not reference
				if (isStatement)
				{
					trie.AddNewNode(level, "<<Statement>>", (string)LT.GetSymbol(currentToken).Value);
					if (!(LT.VariableExist((string)LT.GetSymbol(currentToken).Value)))
						LT.AddToVariables((string)LT.GetSymbol(currentToken).Value, 0, false);
					Advance_LookAhead();
					return true;
				}
				//this is used in the parse fork just to show the user what variables they need to init
				else if (this.isFromParseFunc)
				{
					string varName = (string)LT.GetSymbol(currentToken).Value;
					trie.AddNewNode(level + 1, "<<Factor>>", (string)varName);
					LT.AddToVariables((string)LT.GetSymbol(currentToken).Value, 0, isFromParseFunc);
					Advance_LookAhead();
					return true;
				}
				//this is used if the variable is already declared and initialised 
				else if (LT.VariableExist((string)LT.GetSymbol(currentToken).Value))
				{
					string varName = (string)LT.GetSymbol(currentToken).Value;
					trie.AddNewNode(level + 1, "<<Factor>>", (string)varName + " -> " + LT.GetVarValue(varName));
					Advance_LookAhead();
					return true;
				}
				//this is used if a variable is used but not declared
				else
				{
					Return = "Variable " + LT.GetSymbol(currentToken).Value + " not initialised";
					Advance_LookAhead();
				}
			}
			return false;
		}
	}
}