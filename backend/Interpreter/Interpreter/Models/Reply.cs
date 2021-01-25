using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using static Interpreter.Models.ParseTree;

namespace Interpreter.Models
{
    //This is the parent class of the Replies, the only sharing quality is
    //the print to console function.
    public abstract class Reply
    {
        public string status;
        public void PrintToConsole()
        {
            Console.WriteLine(JsonConvert.SerializeObject(this));
        }

        internal abstract PositiveReply ChangeAST(ParsedTreeNode aST);
    }

    //This reply is used when reporting a positive return
    //status:"good"
    //abst: abstract syntax trie of the last expression/statement
    //variables: is the variables dictionary after the last expression/statement
    //output: will be the result of the last expression/statement
    public class PositiveReply : Reply
    {
        public List<string> ops { get; set; }
        public Dictionary<string, object> variables { get; set; }
        public double output { get; set; }
        public Dictionary<double, double> points { get; set; }

        public PositiveReply(List<string> ops, Dictionary<string, object> variables, double output)
        {
            this.status = "good";
            this.ops = ops;
            this.variables = variables;
            this.output = output;
        }

        public PositiveReply(List<string> ops, Dictionary<string, object> variables, double output, Dictionary<double, double> points) : this(ops, variables, output)
        {
            this.points = points;
        }

        internal override PositiveReply ChangeAST(ParsedTreeNode AST)
        {
            //this.AST = AST;
            return this;
        }
    }

    //This reply is used when reporting an error.
    //status:"bad"
    //type: where the error occured lexer or parser
    //error: is more detail on what occured
    //location: is what expression/statement it happened on
    public class ErrorReply : Reply
    {
        public string type { get; set; }
        public string error { get; set; }
        public string location { get; set; }

        public ErrorReply(string type, string error, string location)
        {
            this.status = "bad";
            this.type = type;
            this.error = error;
            this.location = location;
        }

        internal override PositiveReply ChangeAST(ParsedTreeNode aST)
        {
            throw new NotImplementedException();
        }
    }
}