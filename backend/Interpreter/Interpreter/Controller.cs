using Interpreter.Models;
using Microsoft.FSharp.Collections;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace Interpreter
{
    public class Controller
    {
        public static void Main(string[] args)
        {
            Config config = new Config();
            LookupTable lt = new LookupTable(config.MAX_TOKENS); // Class to store Tokens and Symbols
            string Command = "";

            try
            {
                //this is the command string which chooses which operation the interpreter will do
                Command = args[0].Trim(new Char[] { '[', ',', '\'', ']' });
            }
            catch (Exception)
            {
                new ErrorReply("Controller error", "No arguements given", Command).PrintToConsole();
                return;
            }

            //This sets it down the newton raphson root root.
            if (Command == "rootofpoly")
            {
                //This deserializes the list of doubles used for the method
                dynamic text = JsonConvert.DeserializeObject(args[1]);

                //These are preset from the config file and are used for the f# functions
                double error = config.ErrorMargin;
                double seed = config.Seed;

                //This loops over each double and adds it to a list
                //which is then converted to a f# list
                var inputs = new List<double>();
                foreach (string s in text)
                {
                    inputs.Add(Double.Parse(s));
                }
                var fs_list = ListModule.OfSeq(inputs);

                double result = NewtonRoot.CNewton(fs_list, seed, error);

                //This calls and replys back the result from the f# method
                new PositiveReply(null, null, result).PrintToConsole();

                return;
            }
            //this fork just parses the expression/statement
            else if (Command == "parse")
            {
                //deserializes the list of expressions/statements
                dynamic text = JsonConvert.DeserializeObject(args[1]);

                //inits a reply
                Reply reply = null;

                //This loops over every expression/statement
                foreach (string s in text)
                {
                    //This sets the reply from the parse function
                    reply = Parse(ref lt, s, true);

                    //If an error has occured te interpreter returns it before parsing all loops
                    if (reply is ErrorReply)
                    {
                        Console.WriteLine(JsonConvert.SerializeObject(reply));
                        return;
                    }
                }

                //if no error has occured it returns the reply of the last statement/error 

                new PositiveReply(lt.operations, lt.variables, 0).PrintToConsole();

                return;

            }
            //This fork both parses and executes the list of expressions/statements
            else if (Command == "expression")
            {
                dynamic text = JsonConvert.DeserializeObject(args[1]);

                double final_result = 0.0;

                foreach (string s in text)
                {
                    Reply reply = Parse(ref lt, s, false);

                    //if an error is found at any point it returns early with an error
                    if (reply is ErrorReply)
                    {
                        Console.WriteLine(JsonConvert.SerializeObject(reply));
                        return;
                    }
                    //if not it runs the executor
                    else
                    {
                        //Init the executor and get the result of parsed tokens
                        //then resets the symbol table for the next expression/statement
                        double result = 0.0;
                        Executor exe = new Executor(ref lt, false);

                        try
                        {
                            result = exe.ShuntYard();
                        }
                        catch (Exception e)
                        {
                            new ErrorReply("Executor error", e.Message, s).PrintToConsole();
                            return;
                        }

                        lt.InitSymbols();
                        lt.operations = exe.operations;

                        //This is used for output
                        final_result = result;
                    }
                }
                //This sets the abst for output and then sends the reply
                //LT.pt.SetAST();
                new PositiveReply(lt.operations, lt.variables, final_result).PrintToConsole();
                return;
            }
            else if (Command == "cal")
            {
                dynamic input = JsonConvert.DeserializeObject(args[1]);
                string var = "";
                double from = 0.0;
                double to = 0.0;
                double step = 0.0;
                string expression = "";

                int i = 0;

                foreach (string obj in input)
                {
                    if (i == 0)
                        var = obj;
                    if (i == 1)
                        from = Double.Parse(obj);
                    if (i == 2)
                        to = Double.Parse(obj);
                    if (i == 3)
                        step = Double.Parse(obj);
                    if (i == 4)
                        expression = obj;
                    i++;
                }


                Dictionary<double, double> points = new Dictionary<double, double>();

                while (from <= to)
                {
                    Reply reply = Parse(ref lt, expression, false, (var, from));

                    //if an error is found at any point it returns early with an error
                    if (reply is ErrorReply)
                    {
                        Console.WriteLine(JsonConvert.SerializeObject(reply));
                        return;
                    }
                    //if not it runs the executor
                    else
                    {
                        //Init the executor and get the result of parsed tokens
                        //then resets the symbol table for the next expression/statement
                        Executor exe = new Executor(ref lt, false);

                        try
                        {
                            points.Add(from, exe.ShuntYard());
                        }
                        catch (Exception e)
                        {
                            new ErrorReply("Executor error", e.Message, expression).PrintToConsole();
                            return;
                        }

                        //This is used for output
                        lt.InitSymbols();


                    }
                    from += step;
                }
                //This sets the abst for output and then sends the reply
                //LT.pt.SetAST();
                new PositiveReply(lt.operations, lt.variables, points.Count, points).PrintToConsole();
                return;
            }
            else if (Command == "env")
            {
                Executor exe = new Executor(ref lt, false);

                while (true)
                {
                    Console.WriteLine("------------");

                    Dictionary<string, object> vars = new Dictionary<string, object>();

                    string input = Console.ReadLine();
                    double final_result = 0.0;

                    if (input == "EXIT")
                    {
                        return;
                    }

                    Reply reply = Parse(ref lt, input, false);

                    foreach (KeyValuePair<string, object> pair in vars)
                        lt.variables.Add(pair.Key, pair.Value);

                    //if an error is found at any point it returns early with an error
                    if (reply is ErrorReply)
                    {
                        Console.WriteLine(JsonConvert.SerializeObject(reply));
                    }
                    //if not it runs the executor
                    else
                    {
                        //Init the executor and get the result of parsed tokens
                        //then resets the symbol table for the next expression/statement
                        double result = 0.0;

                        try
                        {

                            result = exe.ShuntYard();
                            //This is used for output
                            final_result = result;
                            new PositiveReply(exe.operations, lt.variables, final_result).PrintToConsole();
                        }
                        catch (Exception e)
                        {
                            new ErrorReply("Executor error", e.Message, input).PrintToConsole();
                        }

                    }
                    exe.operations.Clear();
                    lt.InitSymbols();
                }
            }
            //if the command variable is not recognised it will throw this error
            else
            {
                new ErrorReply("Interpreter error", "Unknown command", Command).PrintToConsole();
            }
        }




        /// <summary>
        /// This function is the parser but modular so both forks can use it
        /// </summary>
        /// <param name="lt"> ref LookupTable</param>
        /// <param name="s"> string s</param>
        /// <param name="isFromParseFunc"> bool for checking which function the call came from</param>
        /// <returns></returns>
        public static Reply Parse(ref LookupTable lt, string s, bool isFromParseFunc)
        {
            //This inits the lexer and processes it
            Lexicon lex = new Lexicon(ref s, ref lt);
            (int, string) lexResult = lex.Process();

            //If the lexer recognises more than one token it will parse the tokens
            if (lexResult.Item1 > 0)
            {
                //Parsing begins
                Parser parser = new Parser(ref lt, isFromParseFunc);
                string parseResult = parser.Parse();

                //If the parser correctly parses
                if (parseResult == "p")
                {
                    //Creates a temporary variables dictionary
                    //This is used to see if a stement/expression is BNF correct and
                    //what variables it needs to execute.
                    if (isFromParseFunc)
                    {

                        return new PositiveReply(null, lt.variables, 0);
                    }
                    return new PositiveReply(null, null, 0);
                }
                //If the parser encounters an error
                else
                {
                    return new ErrorReply("Parser Error", parseResult, s);
                }
            }
            //If the lexer doesn't recognise any tokens it will throw this error
            else
            {
                return new ErrorReply("Lexicon Error", lexResult.Item2, s);
            }
        }

        public static Reply Parse(ref LookupTable lt, string s, bool isFromParseFunc, (string, double) var)
        {
            //This inits the lexer and processes it
            Lexicon lex = new Lexicon(ref s, ref lt);
            (int, string) lexResult = lex.Process();

            //If the lexer recognises more than one token it will parse the tokens
            if (lexResult.Item1 > 0)
            {
                //Parsing begins
                Parser parser = new Parser(ref lt, isFromParseFunc);
                lt.AddToVariables(var.Item1, var.Item2, false);
                string parseResult = parser.Parse();

                //If the parser correctly parses
                if (parseResult == "p")
                {
                    //Creates a temporary variables dictionary
                    //This is used to see if a stement/expression is BNF correct and
                    //what variables it needs to execute.
                    if (isFromParseFunc)
                    {

                        return new PositiveReply(null, lt.variables, 0);
                    }
                    return new PositiveReply(null, null, 0);
                }
                //If the parser encounters an error
                else
                {
                    return new ErrorReply("Parser Error", parseResult, s);
                }
            }
            //If the lexer doesn't recognise any tokens it will throw this error
            else
            {
                return new ErrorReply("Lexicon Error", lexResult.Item2, s);
            }
        }
    }
}
