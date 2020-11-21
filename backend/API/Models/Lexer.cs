using System;
using static LookupTable;
using static LookupTable.Symbol;
using static LookupTable.Tokens;

public class Lexer
{
	char[] input; //Input parsed through reference
	LookupTable lt; //Lookup Table parsed thorugh reference
	int MAX_TOKENS;

	public Lexer(ref char[] input, ref int MAX_TOKENS, ref LookupTable lt)
	{
		this.input=input;
		this.MAX_TOKENS = MAX_TOKENS;
		this.lt = lt;
	}

	public int Process()
	{
		int token_i = 0; //Token Counter
		for (int i = 0; input[i]!='\n'; ++i) //For loop to go through input
		{
			if (token_i == MAX_TOKENS) //If token count is the same size as max tokens stop the lexer 
				break;

			switch (input[i])
			{
				case (' '): break; //Used to ignore spaces from the input

				case ('='): //Used to assign variable
					{
						lt.addSymbol(token_i++, Equal, 0);
						break;
					}

				case ('+'): //Used to add the plus to the token array
					{
						lt.addSymbol(token_i++, Plus, 0);
						break;
					}

				case ('-'): //Used to add the minus to the token array
					{
						lt.addSymbol(token_i++, Minus, 0);
						break;
					}

				case ('^'): //Used to add the multiplication to the token array
					{
						lt.addSymbol(token_i++, Exponent, 0);
						break;
					}

				case ('*'): //Used to add the multiplication to the token array
					{
						lt.addSymbol(token_i++, Multiply, 0);
						break;
					}

				case ('/'): //Used to add the division to the token array
					{
						lt.addSymbol(token_i++, Divide, 0);
						break;
					}
				
				case ('('): //Used to add the left bracket to the token array
					{
						lt.addSymbol(token_i++, Left_Para, 0);
						break;
					}
				
				case (')'): //Used to add the right bracket to the token array
					{
						lt.addSymbol(token_i++, Right_Para, 0);
						break;
					}


				default: //If no symbol above is found
					{
						if (!Char.IsLetterOrDigit(input[i]))
						{
							break;
						}
						else if (Char.IsLetter(input[i])) 
						{
							/*
							 * If the current char is a letter we find out what the following number is
							 * then converting the char to a byte for storage as a token and storing the 
							 * number in the symbol table
							 */
							string varName = "";
							while (Char.IsLetter(input[i]))
							{
								varName += input[i];
								++i;
							}
							lt.addSymbol(token_i++, Tokens.Varaible, varName);
							if (!lt.variableExist(varName))
								lt.addToVariables(varName, new Var(false, false));
							--i;
							break;
						}
						else
						{
							/*
							 * This is very similar to the above but just counts out numbers by themselves.
							 * So the token for number is stored in the token table and the number is stored
							 * in symbol table.
							 */
							 
							int number_counter = 0;
							char[] number = new char[input.Length];
							bool isFloat = false;
							while (Char.IsDigit(input[i]) || (input[i]=='.'))
							{
								if (input[i] == '.')
									isFloat = true;

								number[number_counter++] = input[i];
								++i;
							}
							if (isFloat)
							{
								lt.addSymbol(token_i++, Float, float.Parse(new string(number)));
							}
							else
							{
								lt.addSymbol(token_i++, Integer,int.Parse(new string(number)));
							}
							--i;
							break;
						}
					}

			}

		}
		//int fill_array=token_i;
		//while (fill_array < lt.symbols.Length)
		//{
		//	lt.symbols[fill_array++] = new Symbol(Tokens.EMPTY, 0);
		//}

		Array.Resize(ref lt.symbols, token_i);


		return token_i;
	}













}
