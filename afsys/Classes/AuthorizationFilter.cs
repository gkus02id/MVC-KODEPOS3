using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace afsys.Classes
{
    public class AuthorizationFilter : AuthorizeAttribute, IAuthorizationFilter
    {
        public string Message { get; set; }

        public SqlConnection oCon;

        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            if (filterContext.ActionDescriptor.IsDefined(typeof(AllowAnonymousAttribute), true)
                || filterContext.ActionDescriptor.ControllerDescriptor.IsDefined(typeof(AllowAnonymousAttribute), true))
            {
                // Don't check for authorization as AllowAnonymous filter is applied to the action or controller
                return;
            }

            // Check for authorization
            if (HttpContext.Current.Session["user-id"] == null)
            {
                //filterContext.RequestContext.HttpContext;

                filterContext.Result = new HttpUnauthorizedResult();
            }
        }
    }
}
