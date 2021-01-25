using System;
using System.Collections;
using System.Collections.Generic;
using static Interpreter.Models.LookupTable;

namespace Interpreter.Models
{

	//This class executes the expression using a modified version of the Shunting
	//Yard algorithm by Rudy Lapeer. 
	public class Executor
	{
		LookupTable LT { get; set; }
		Stack Operators { get; set; }
		Stack Numbers { get; set; }
		double operand1, operand2;
		Tokens operatorID;
		public List<string> operations { get; set; }
		bool fromParse = false;

		//Inits a fresh executor
		public Executor(ref LookupTable lt, bool fromParse)
		{
			this.LT = lt;
			Operators = new Stack();
			Numbers = new Stack();
			operand1 = operand2 = 0;
			operatorID = Tokens.EMPTY;
			this.fromParse = fromParse;
			operations = new List<string>();
		}

		/// <summary>
		/// This function calculates the result of an operation by taking
		/// two numbers of the numbers stack and an operater of the stack.
		/// The result of the caclulation is then pushed back into the 
		/// numbers stack as a running total.
		/// </summary>
		public void Calculate()
		{
			//operand1 only has a tuple as only an = operation 
			//requires the left operator to be set
			(string, double) op1 = ("", 0);
			(string, double) op2 = ("", 0);
			string op1output = "";
			string op2output = "";
			string operatorOut = "";

			operatorID = (Tokens)Operators.Pop();

			//This section checks to see if the object in the numbers stack is a string
			//this will mean it is a variable and sets the op2 variable as as so.
			if (Numbers.Peek() is string)
			{
				string var = (string)Numbers.Pop();
				op2 = (var, (double)LT.variables[var]);
				operand2 = op2.Item2;
				op2output = var;
			}
			else
			{
				operand2 = Convert.ToDouble(Numbers.Pop());
				op2output = operand2.ToString();
			}
			if (Numbers.Peek() is string)
			{
				string var = (string)Numbers.Pop();
				op1 = (var, (double)LT.variables[var]);
				operand1 = op1.Item2;
				op1output = var;
			}
			else
			{
				operand1 = Convert.ToDouble(Numbers.Pop());
				op1output = operand1.ToString();
			}

			//This section is just a switch case to decide which operation
			//should be performed to the two operands.
			double result = 0;
			switch (operatorID)
			{
				case Tokens.Plus:
					result = operand1 + operand2;
					Numbers.Push(result);
					operatorOut = "+";
					break;

				case Tokens.Minus:
					result = operand1 - operand2;
					Numbers.Push(result);
					operatorOut = "-";
					break;

				case Tokens.Exponent:
					result = Math.Pow(operand1, operand2);
					Numbers.Push(result);
					operatorOut = "^";
					break;

				case Tokens.Multiply:
					result = operand1 * operand2;
					Numbers.Push(result);
					operatorOut = "*";
					break;

				case Tokens.Divide:
					result = operand1 / operand2;
					Numbers.Push(result);
					operatorOut = "/";
					break;

				case Tokens.Equal:
					LT.UpdateVariable(key: op1.Item1, operand2);
					op1output = op1.Item1;
					operatorOut = "=";
					break;
			}

			operations.Add(op1output + "," + operatorOut + "," + op2output);
		}

		/// <summary>
		/// This is the modified Shunting Yard algorithm. First it reads the symbols/tokens
		/// and pushes them to the correct stack. It will then call calulate on certain operators,
		/// this follows order of presidence/BIDMAS
		/// </summary>
		/// <returns></returns>
		public double ShuntYard()
		{
			int count = 0;

			while (count < LT.symbols.Length)
			{
				switch (LT.GetSymbol(count).Type)
				{
					case Tokens.Integer:
						Numbers.Push(LT.GetSymbol(count++).Value);
						break;

					case Tokens.Double:
						Numbers.Push(LT.GetSymbol(count++).Value);
						break;

					case Tokens.Variable:
						Numbers.Push(LT.GetSymbol(count++).Value);
						break;

					case Tokens.Equal:
						Operators.Push(LT.GetSymbol(count++).Type);
						break;

					case Tokens.Plus:
						while (Operators.Count > 0 && (Tokens)Operators.Peek() != Tokens.Left_Parenthesis && (Tokens)Operators.Peek() != Tokens.Equal)
						{
							Calculate();
						}
						Operators.Push(LT.GetSymbol(count++).Type);
						break;

					case LookupTable.Tokens.Minus:
						while (Operators.Count > 0 && (Tokens)Operators.Peek() != Tokens.Left_Parenthesis && (Tokens)Operators.Peek() != Tokens.Equal)
						{
							Calculate();
						}
						Operators.Push(LT.GetSymbol(count++).Type);
						break;

					case LookupTable.Tokens.Multiply:
						while (Operators.Count > 0 && (Tokens)Operators.Peek() != Tokens.Left_Parenthesis
							&& (Tokens)Operators.Peek() != Tokens.Plus && (Tokens)Operators.Peek() != Tokens.Minus
							&& (Tokens)Operators.Peek() != Tokens.Equal)
						{
							Calculate();
						}
						Operators.Push(LT.GetSymbol(count++).Type);
						break;

					case LookupTable.Tokens.Divide:
						while (Operators.Count > 0 && (Tokens)Operators.Peek() != Tokens.Left_Parenthesis
							&& (Tokens)Operators.Peek() != Tokens.Plus && (Tokens)Operators.Peek() != Tokens.Minus
							&& (Tokens)Operators.Peek() != Tokens.Equal)
						{
							Calculate();
						}
						Operators.Push(LT.GetSymbol(count++).Type);
						break;

					case LookupTable.Tokens.Exponent:
						while (Operators.Count > 0 && (Tokens)Operators.Peek() != Tokens.Left_Parenthesis
							&& (Tokens)Operators.Peek() != Tokens.Plus && (Tokens)Operators.Peek() != Tokens.Minus
							&& (Tokens)Operators.Peek() != Tokens.Equal && (Tokens)Operators.Peek() != Tokens.Multiply
							&& (Tokens)Operators.Peek() != Tokens.Divide)
						{
							Calculate();
						}
						Operators.Push(LT.GetSymbol(count++).Type);
						break;

					case LookupTable.Tokens.Left_Parenthesis:
						Operators.Push(LT.GetSymbol(count++).Type);
						break;

					case LookupTable.Tokens.Right_Parenthesis:
						while (Operators.Count > 0 && (LookupTable.Tokens)Operators.Peek() != LookupTable.Tokens.Left_Parenthesis)
						{
							Calculate();
						}
						if ((LookupTable.Tokens)Operators.Peek() == LookupTable.Tokens.Left_Parenthesis)
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
			//This is a fail safe to make sure that all operators are used.
			while (Operators.Count > 0)
			{
				Calculate();
			}

			//This if exists as an assignment of a variable will not return back
			//to the numbers stack. 
			if (Numbers.Count == 1)
			{
				return Convert.ToDouble(Numbers.Pop());
			}
			else
			{
				return 0;
			}
		}
	}
}