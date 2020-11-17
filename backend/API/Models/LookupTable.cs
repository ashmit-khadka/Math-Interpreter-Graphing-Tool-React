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
		Left_Curly = 6,
		Right_Curly = 7,
		Left_Para = 8,
		Right_Para = 9,
		Integer = 10,
		Float = 11,
		Variable = 12,
		Comma = 13
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
			variable = new Var("",false,null);
		}

		public Symbol(Tokens type, Object value, Var variable)
		{
			this.type = type;
			this.value = value;
			this.variable = variable;
		}

		public Tokens type;
		public Object value;
		public Var variable;

		public bool IsVar()
		{
			return !(this.variable.Value is null);
		}

		public override string ToString()
		{
			if (IsVar())
			{
				return type.ToString() + " " + variable;
			}
			else
				return type.ToString() + " " + value.ToString();
		}

		public struct Var
		{
			public Var(string name, bool isPtr, Object value)
			{
				this.Name = name;
				this.IsPtr = isPtr;
				this.Value = value;
			}
			public string Name { get; }
			public bool IsPtr { get; set; }
			public Object Value { get; set; }

			public override string ToString() {
				if (IsPtr)
					return Name + " is pointer to symbol " + Value;
				
				return Name +" "+ Value; 
			}
		}
	}
}