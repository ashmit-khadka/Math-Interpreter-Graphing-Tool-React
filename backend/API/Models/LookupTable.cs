using System;

public class LookupTable
{
	/*
	 * This class is used for storing tokens
	 * and symbols so that both the lexer and
	 * parser can access them.
	 */

	public enum Tokens : int
	{
		EMPTY = -1,
		Plus = 0,
		Minus = 1,
		Multiply = 2,
		Divide = 3,
		Exponent = 4,
		Equal = 5,
		Left_Para = 7,
		Right_Para = 8,
		Integer = 9,
		Float = 10,
		Varaible = 11
	}
	//DICTIONARY

	public Symbol[] symbols;

	public LookupTable(int MAX_TOKENS)
	{
		symbols = new Symbol[MAX_TOKENS]; //remake to support variable pointers!
	}

	public struct Symbol
	{
		public Symbol(Tokens type, Object value)
		{
			this.type = type;
			this.value = value;
		}

		public Tokens type { get; }
		public Object value { get; }
		public struct Var
		{
			public Var(string name, bool isPtr, Object value)
			{
				this.name = name;
				this.isPtr = isPtr;
				this.value = value;
			}
			public string name { get; }
			public bool isPtr { get; set; }
			public Object value { get; set; }

			public override string ToString() { return name +" "+ value; }
		}
	}
}