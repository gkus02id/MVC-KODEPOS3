using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace afsys.Models
{
    public class OutputModels
    {
        public OutputModels()
        {
            this.message = "";
            this.reference = "";
            this.option = "";
            this.req = "";
            this.code = "";
            this.locked_by = "";
            this.locked_date = "";
        }
        public String code { get; set; }
        public String message { get; set; }
        public String reference { get; set; }
        public String option { get; set; }
        public String req { get; set; }
        public String locked_by { get; set; }
        public String locked_date { get; set; }
    }
}