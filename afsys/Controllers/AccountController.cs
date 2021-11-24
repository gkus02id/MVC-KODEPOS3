using System;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using System.Data;
using System.Data.SqlClient;
using afsys.Models;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using afsys.Classes;

namespace afsys.Controllers
{
    [AllowAnonymous, OutputCache(Location = OutputCacheLocation.None, NoStore = true)]
    public class AccountController : Controller
    {

        public SqlConnection oCon;

        public AccountController()
        {
        }

        [AllowAnonymous]
        public ActionResult CheckUser()
        {
            ViewBag.response = "";

            if (!String.IsNullOrEmpty(Session["user-id"].ToString()))
            {
                OutputModels output = new OutputModels();
                output.code = "1";
                output.message = "";
                ViewBag.response = JsonConvert.SerializeObject(output);
            }
            else
            {
                OutputModels output = new OutputModels();
                output.code = "0";
                output.message = "";
                ViewBag.response = JsonConvert.SerializeObject(output);
            }

            return View("custom", "_Blank", null);
        }

        //
        // GET: /Account/Login
        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {
            return View("Login", "_Login", null);
        }

        // GET: /Account/Login
        [AllowAnonymous]
        public ActionResult Logout()
        {
            oCon = Database.OpenSqlConnection("");
            Session.Abandon();
            return RedirectToAction("Login", "Account");
        }

        [HttpPost]
        public ActionResult Validate(FormCollection collection)
        {
            ViewBag.response = "";

            try
            {
                if (!String.IsNullOrEmpty(collection["username"]))
                {
                    oCon = Database.OpenSqlConnection("");
                    ViewBag.response = Security.Login(oCon, Security.shield(collection["username"]), Security.shield(collection["password"]));
                }
                else
                {
                    OutputModels output = new OutputModels();
                    output.code = "0";
                    output.message = "Akun salah";
                    ViewBag.response = JsonConvert.SerializeObject(output);
                }
            }
            catch (Exception ex)
            {
                Utils.WriteLog("Error Message : \r\n" + ex.Message + "\r\nusername Param : " + collection["username"], "AccountController", "Validate");
            }
            finally
            {
                //if (oCon != null) Database.CloseSqlConnection(oCon);
            }


            return View("custom", "_Blank", null);
        }
    }   
}