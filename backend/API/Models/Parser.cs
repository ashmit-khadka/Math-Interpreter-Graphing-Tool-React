using System;
using static LookupTable.Symbol;

public class Parser
{
	int LookAhead;
	int currentToken;
	bool ret;
	LookupTable lt;
	ParsedTrie trie; 


	public Parser(ref LookupTable lt)
	{
		this.LookAhead = -1;
		this.currentToken = 0;
		this.ret = true;
		this.lt = lt;
		trie = new ParsedTrie();
	}

	/*	BNF
	 *	<expression> ::= <term> <expression_prime>
	 *	<expression_prime> ::= + <term> <expression_prime>
	 *	<expression_prime> ::= - <term> <expression_prime>
	 *	<term> ::= <factor> <term_prime>
	 *	<term_prime> ::= ^ <factor> <term_prime>
	 *	<term_prime> ::= * <factor> <term_prime>
	 *	<term_prime> := / <factor> <term_prime>
	 *	<factor> ::= number | variable | (<expr>)
	 */

	public bool Parse()
	{
		/*Check that lt is parsed correctly 
		*/
		Expression(0);
		trie.PrintWidthFirst();
		return ret;

	}

	bool Match_Token(int token)
	{
		this.LookAhead = (int)lt.symbols[currentToken].type;
		return (LookAhead.Equals(token));

	}

	void Advance_LookAhead()
	{
		this.LookAhead = (int)lt.symbols[++currentToken].type;
	}

	void Expression(int level)
	{
		//Console.WriteLine("Expression() Called at level {0}", level);
		if (level == 0)
		{
			trie.AddNewNode(level, LookupTable.Tokens.EMPTY, "<<Expression>>");
		}
		else
		{
			trie.AddNewNode(level, "<<Factor>>", "<<Expression>>");
		}
		Term(level+1, true);
		Expression_Prime(level+1);
	}

	void Expression_Prime (int level)
	{
		//Console.WriteLine("Expression_Prime() Called at level {0}", level);
		trie.AddNewNode(level, "<<Expression>>", "<<Expression_Prime>>");
		if (Match_Token((int)(LookupTable.Tokens.Plus)))
		{
			trie.AddNewNode(level + 1, "<<Expression_Prime>>", LookupTable.Tokens.Plus);
			Advance_LookAhead();
			Term(level + 1, false);
			Expression_Prime(level + 1);
		}
		else if (Match_Token((int)(LookupTable.Tokens.Minus)))
		{
			trie.AddNewNode(level + 1, "<<Expression_Prime>>", LookupTable.Tokens.Minus);
			Advance_LookAhead();
			Term(level + 1, false);
			Expression_Prime(level + 1);
		}
	}

	void Term(int level, bool isCalledFromExp) 
	{
		if (isCalledFromExp)
		{
			trie.AddNewNode(level, "<<Expression>>", "<<Term>>");
		}
		else
		{
			trie.AddNewNode(level, "<<Expression_Prime>>", "<<Term>>");
		}
		//Console.WriteLine("Term() Called at level {0}", level);
		Factor(level + 1,true);
		Term_Prime(level + 1);
	}


	void Term_Prime(int level)
	{
		trie.AddNewNode(level, "<<Term>>", "<<Term_Prime>>");
		//Console.WriteLine("Term_Prime() Called at level {0}", level);
		if (Match_Token((int)(LookupTable.Tokens.Multiply)))
		{
			trie.AddNewNode(level+1, "<<Term_Prime>>", LookupTable.Tokens.Multiply);
			Advance_LookAhead();
			Factor(level + 1,false);
			Term_Prime(level + 1);
		}
		else if (Match_Token((int)(LookupTable.Tokens.Divide)))
		{
			trie.AddNewNode(level + 1, "<<Term_Prime>>", LookupTable.Tokens.Divide);
			Advance_LookAhead();
			Factor(level + 1,false);	
			Term_Prime(level + 1);
		}
		else if (Match_Token((int)(LookupTable.Tokens.Exponent)))
		{
			trie.AddNewNode(level + 1, "<<Term_Prime>>", LookupTable.Tokens.Exponent);
			Advance_LookAhead();
			Factor(level + 1,false);
			Term_Prime(level + 1);
		}
	}

	void Factor(int level, bool isCalledFromTerm)
	{
		if (isCalledFromTerm)
		{
			trie.AddNewNode(level, "<<Term>>", "<<Factor>>");
		}
		else
		{
			trie.AddNewNode(level, "<<Term_Prime>>", "<<Factor>>");
		}
		
		if (Match_Token((int)LookupTable.Tokens.Integer) || (Match_Token((int)LookupTable.Tokens.Float)))
		{
			//Console.WriteLine("factor -> {0}", lt.symbols[currentToken].value.ToString());
			trie.AddNewNode(level+1, "<<Factor>>", lt.symbols[currentToken].value);
			Advance_LookAhead();
		}
		else if (Match_Token((int)LookupTable.Tokens.Varaible))
		{
			trie.AddNewNode(level+1, "<<Factor>>", lt.symbols[currentToken].value);
			//Var a = (Var)lt.symbols[currentToken].value;
			Advance_LookAhead();
		
		}
		else if (Match_Token((int)LookupTable.Tokens.Left_Para))
		{
			Advance_LookAhead();
			Expression(level + 1);
			if (Match_Token((int)LookupTable.Tokens.Right_Para))
			{
				Advance_LookAhead();
			}
			else ret = false;
		}

		else ret = false;
	}








}
