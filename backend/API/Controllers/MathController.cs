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
