using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using afsys.Classes;

namespace afsys.Controllers
{
    [OutputCache(Location = OutputCacheLocation.None, NoStore = true)]
    public class HomeController : Controller
    {
        public SqlConnection oCon;

        [AuthorizationFilter]
        public ActionResult Index(FormCollection collection)
        {
            String userAvatar = "";
            var rootUrl = new System.UriBuilder(Request.Url.AbsoluteUri)
                          {
                            Path = Url.Content("~"),
                            Query = null,
                          };

            oCon = Database.OpenSqlConnection("");
           
            userAvatar = "avatar5.png";

            if (!String.IsNullOrEmpty(Utils.getParameter("percent_zoom_layout")))
            {
                ViewBag.percent_zoom_layout = Utils.getParameter("percent_zoom_layout") + "%";
            }
            else
            {
                ViewBag.percent_zoom_layout = "80%";
            }
           
            /*Default-content, must be exist in all View Object */
            ViewBag.app_name = "KODEPOS";
            
            ViewBag.username = "TEST";
            ViewBag.root_url = rootUrl;

            ViewBag.user_avatar = userAvatar;

            return View();
        }
        
       
    }
}