using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace API.Models
{
    [DataContract]
    public class MathResponse
    {
        [DataMember(Name = "result")]
        public double Result { get; set; }
    }
}
