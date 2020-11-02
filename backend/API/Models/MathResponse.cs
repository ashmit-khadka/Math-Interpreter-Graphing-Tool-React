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
        public int Result { get; set; }
    }
}