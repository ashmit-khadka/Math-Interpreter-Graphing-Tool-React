using API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace API.Controllers
{
    public class MathController : ApiController
    {
        // GET: api/Math
        public MathResponse Get(string equation)
        {

            var response = new MathResponse
            {
                Result = equation.Length
            };
            return response;
        }

        public MathResponse Test(string equation)
        {
            int MAX_TOKENS = 16; //Maximum number of tokens the lexer will define
            int MAX_CHAR = 16; //Maximum characters taken from input
            LookupTable lt = new LookupTable(MAX_TOKENS); // Class to store Tokens and Symbols
            int NO_tokens; //Number of tokens
            char[] input = equation.ToCharArray();
            Lexer lex = new Lexer(ref input, ref MAX_TOKENS, ref lt);
            lex.Process();   
            Parser parser = new Parser(ref lt);
            parser.Parse();
            Executor executor = new Executor(ref lt);
            double result = executor.ShuntYard();

            var response = new MathResponse
            {
                Result = result
            };
            return response;
        }

        // GET: api/Math/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Math
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Math/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Math/5
        public void Delete(int id)
        {
        }
    }
}
