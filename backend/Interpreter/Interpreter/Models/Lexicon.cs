using System;
using System.Collections;
using static Interpreter.Models.LookupTable;
using static Interpreter.Models.LookupTable.Tokens;

namespace Interpreter.Models
{

    public class Lexicon
    {
        readonly string input; //Input parsed through reference
        readonly LookupTable LT; //Lookup Table parsed thorugh reference

        public Lexicon(ref string input, ref LookupTable lt)
        {
            this.input = input;
            this.LT = lt;
        }

        /// <summary>
        /// This function processes the string of input given and uses a switch case to make
        /// the symbol table.
        /// </summary>
        /// <returns> A tuple of number of tokens and either true or an error</returns>
        public (int, string) Process()
        {
            int input_length = input.Length;
            int token_i = 0; //Token Counter
            for (int i = 0; i < input_length; ++i) //For loop to go through input
            {
                if (token_i == LT.MAX_TOKENS) //If token count is the same size as max tokens stop the lexer 
                    break;

                switch (input[i])
                {
                    case (' '): break; //Used to ignore spaces from the input

                    case ('='): //Used to assign variable
                        {
                            LT.symbols[token_i++] = new Symbol(Equal, 0);
                            break;
                        }

                    case ('+'): //Used to add the plus to the token array
                        {
                            LT.symbols[token_i++] = new Symbol(Plus, 0);
                            break;
                        }

                    case ('-'): //Used to add the minus to the token array
                        {
                            LT.symbols[token_i++] = new Symbol(Minus, 0);
                            break;
                        }

                    case ('^'): //Used to add the multiplication to the token array
                        {
                            LT.symbols[token_i++] = new Symbol(Exponent, 0);
                            break;
                        }

                    case ('*'): //Used to add the multiplication to the token array
                        {
                            LT.symbols[token_i++] = new Symbol(Multiply, 0);
                            break;
                        }

                    case ('/'): //Used to add the division to the token array
                        {
                            LT.symbols[token_i++] = new Symbol(Divide, 0);
                            break;
                        }

                    case ('('): //Used to add the left bracket to the token array
                        {
                            LT.symbols[token_i++] = new Symbol(Left_Parenthesis, 0);
                            break;
                        }

                    case (')'): //Used to add the right bracket to the token array
                        {
                            LT.symbols[token_i++] = new Symbol(Right_Parenthesis, 0);
                            break;
                        }

                    case ('P'): //Used to add Pi to then token array
                        {
                            LT.symbols[token_i++] = new Symbol(LookupTable.Tokens.Double, 3.14159);
                            break;
                        }


                    default: //If no symbol above is found
                        {
                            if (!Char.IsLetterOrDigit(input[i]))
                            {
                                return (0, "Unknown symbol " + input[i]);
                            }
                            else if (Char.IsLetter(input[i]))
                            {
                                /*
								 * If the current char is a letter we find out what
								 * then converting the char to a byte for storage as a token 
								 */
                                string varName = "";
                                while (Char.IsLetter(input[i]))
                                {
                                    varName += input[i++];

                                    if (i >= input.Length)
                                    {
                                        break;
                                    }
                                }
                                LT.symbols[token_i++] = new Symbol(Tokens.Variable, varName);
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
                                while (Char.IsDigit(input[i]) || (input[i] == '.'))
                                {
                                    if (input[i] == '.')
                                        isFloat = true;

                                    number[number_counter++] = input[i++];

                                    if (i >= input.Length)
                                    {
                                        break;
                                    }

                                }

                                try
                                {
                                    if (isFloat)
                                    {
                                        LT.symbols[token_i++] = new Symbol(Tokens.Double, double.Parse(new string(number)));
                                    }
                                    else
                                    {
                                        LT.symbols[token_i++] = new Symbol(Integer, int.Parse(new string(number)));
                                    }
                                }
                                catch (Exception)
                                {
                                    try
                                    {
                                        LT.symbols[token_i++] = new Symbol(Tokens.Double, double.Parse(new string(number)));
                                    }
                                    catch (OverflowException)
                                    {
                                        return (0, "Number is too big or small to be Double");
                                    }

                                }


                            }
                            --i;
                            break;
                        }
                }
            }

            int addedOffset = 0;
            ArrayList temp = new ArrayList(LT.symbols);

            //This loops over symbols if it finds a factor next to a variable next to
            //a variable it automatically adds a multiply, allowing for the input of
            //2k = 2*k.
            //It also checks if there is a minus sign without a factor infront of it,
            //at somepoint the program stopped accepting a minus with one factor so this
            //is a fix meaning that
            //-5 = 0-5 
            for (int j = 0; j < (token_i + addedOffset); j++)
            {
                if (LT.symbols[j].Type is Tokens.Double || LT.symbols[j].Type is Integer)
                {
                    if (LT.symbols[j + 1].Type is Tokens.Variable)
                    {
                        temp.Insert(j + 1 + addedOffset, new Symbol(Multiply, 0));
                        addedOffset++;
                    }
                }

                if (LT.symbols[j].Type is Tokens.Minus)
                {
                    if (j == 0)
                    {
                        temp.Insert(j, new Symbol(Integer, 0));
                        addedOffset++;
                    }
                    else if (!((LT.symbols[j - 1].Type is Tokens.Double || LT.symbols[j - 1].Type is Integer || LT.symbols[j - 1].Type is Variable || LT.symbols[j - 1].Type is Right_Parenthesis)))
                    {
                        temp.Insert(j, new Symbol(Integer, 0));
                        addedOffset++;
                    }
                }
            }
            Array.Copy(temp.ToArray(typeof(Symbol)), 0, LT.symbols, 0, token_i + addedOffset);

            //This fills the rest of the symbol array with EMPTY tokens in order to make sure
            //no unpredictable data can cause bugs.
            int fill_array = token_i + addedOffset;
            while (fill_array < LT.symbols.Length)
            {
                LT.symbols[fill_array++] = new Symbol(Tokens.EMPTY, 0.0);
            }

            return (token_i, "true");
        }

    }
}