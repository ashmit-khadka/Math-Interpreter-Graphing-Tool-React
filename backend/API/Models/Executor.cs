using System;
using System.Collections;
using static LookupTable;
using static LookupTable.Tokens;
public class Executor
{
	LookupTable lt;
	Stack Operators;
	Stack Numbers;
	double operand1, operand2;
	LookupTable.Tokens operatorID;

	public Executor(ref LookupTable lt)
	{
		this.lt = lt;
		Operators = new Stack();
		Numbers = new Stack();
		operand1 = operand2 = 0;
		operatorID = LookupTable.Tokens.EMPTY;
	}

	public void Calculate()
	{
		operatorID = (LookupTable.Tokens)Operators.Pop();
		operand2 = Convert.ToDouble(Numbers.Pop());
		operand1 = Convert.ToDouble(Numbers.Pop());
		switch (operatorID)
		{
			case LookupTable.Tokens.Plus:
				Numbers.Push(operand1 + operand2);
				break;
			
			case LookupTable.Tokens.Minus:
				Numbers.Push(operand1 - operand2);
				break;

			case LookupTable.Tokens.Exponent:
				Numbers.Push(Math.Pow(operand1, operand2));
				break;

			case LookupTable.Tokens.Multiply:
				Numbers.Push(operand1 * operand2);
				break;

			case LookupTable.Tokens.Divide:
				Numbers.Push(operand1 / operand2);
				break;
		}
	}

	public double ShuntYard()
	{
		int count = 0;

		while (count < lt.symbols.Length)
		{
			switch (lt.getSymbol(count).type)
			{
				case Integer:
					Numbers.Push(lt.getSymbol(count++).value);
					break;

				case Float:
					Numbers.Push(lt.getSymbol(count++).value);
					break;

				case Equal:

					count++;
					break;

				case Plus:
					while (Operators.Count > 0 && (LookupTable.Tokens)Operators.Peek() != Left_Para)
					{
						Calculate();
					}
					Operators.Push(lt.getSymbol(count++).type);
					break;

				case Minus:
					while (Operators.Count > 0 && (LookupTable.Tokens)Operators.Peek() != Left_Para)
					{
						Calculate();
					}
					Operators.Push(lt.getSymbol(count++).type);
					break;

				case Exponent:
					while (Operators.Count > 0 && (LookupTable.Tokens)Operators.Peek() != Left_Para)
					{
						Calculate();
					}
					Operators.Push(lt.getSymbol(count++).type);
					break;


				case Multiply:
					while (Operators.Count > 0 && (LookupTable.Tokens)Operators.Peek() != Left_Para 
						&& (LookupTable.Tokens)Operators.Peek() != Plus && (LookupTable.Tokens)Operators.Peek() != Minus)
					{
						Calculate();
					}
					Operators.Push(lt.getSymbol(count++).type);
					break;

				case Divide:
					while (Operators.Count > 0 && (LookupTable.Tokens)Operators.Peek() != Left_Para
						&& (LookupTable.Tokens)Operators.Peek() != Plus && (LookupTable.Tokens)Operators.Peek() != Minus)
					{
						Calculate();
					}
					Operators.Push(lt.getSymbol(count++).type);
					break;

				case Left_Para:
					Operators.Push(lt.getSymbol(count++).type);
					break;

				case Right_Para:
					while (Operators.Count > 0 && (LookupTable.Tokens)Operators.Peek() != Left_Para)
					{
						Calculate();
					}
					if ((LookupTable.Tokens)Operators.Peek() == Left_Para)
					{
						Operators.Pop();
					}
					count++;
					break;

				default:
					count++;
					break;
			}
		}
		while (Operators.Count > 0)
		{
			Calculate();
		}
		return Convert.ToDouble(Numbers.Pop());
	}
	


}
