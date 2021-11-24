using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.IO;
using System.Web.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Security.Cryptography;
using System.Text;
using System.Drawing;
using System.Drawing.Imaging;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using afsys.Classes;
using afsys.Models;


namespace afsys.Controllers
{
    [AuthorizationFilter]
    public class KodeposController : Controller
    {
        public String modifyStatus = "INS";
        public String readonlyMode = "";
        public String autonumberFormat = "";
        public String autoNumber;
        public SqlConnection oCon;
        public String customJavascript;
        public OutputModels output;

        // GET: Brandcaf17
        public ActionResult Index()
        {
            ViewBag.menuTitle = "KodePos";
            ViewBag.menuDescription = "...";
            ViewBag.module = "apps";
            ViewBag.subModule = "Kodepos";
            ViewBag.themes = "default";
            ViewBag.urlModule = "javascript:fnLoadingForm('/kodepos')";

            String userAvatar = "";
            var rootUrl = new System.UriBuilder(Request.Url.AbsoluteUri)
            {
                Path = Url.Content("~"),
                Query = null,
            };

            try
            {
                oCon = Database.OpenSqlConnection("");

                String strObjectList = Kodepos.getObjectList(oCon, "html");

                ViewBag.listData = strObjectList;

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

            }
            catch (Exception ex)
            {
                Utils.WriteLog("Error Message : \r\n" + ex.Message, "KodeposController", "Index");
            }

            return View("../Kodepos/Index", "_Blank", null);
        }
        
        public ActionResult PopUpForm(String id)
        {
            Boolean isValid = false;
            
            ViewBag.modify_status = "INS";
            ViewBag.autonumber = "0";
            ViewBag.system_id = "";
            ViewBag.kodepos = "";
            ViewBag.kelurahan = "";
            ViewBag.listPropinsi = "";
            ViewBag.listKecamatan = "";
            ViewBag.lisKabupaten = "";
           
            ViewBag.layoutCSS = "";
            ViewBag.readonlyCSS = "";

            try
            {
                oCon = Database.OpenSqlConnection("");

                ViewBag.listPropinsi = Propinsi.getObjectOptions(oCon, "html", "");
                ViewBag.listKecamatan = Kecamatan.getObjectOptions(oCon, "0", "html", "");
                ViewBag.listKabupaten = Kabupaten.getObjectOptions(oCon, "0", "html", "");
             
                if (!String.IsNullOrEmpty(id))
                {
                    KodeposModels oKodepos = Kodepos.getChoosenObject(oCon, Security.shield(id.ToString()));

                    if (oKodepos != null)
                    {
                        ViewBag.autonumber = oKodepos.ID;
                        ViewBag.kodepos = oKodepos.KODEPOS;
                        ViewBag.kelurahan = oKodepos.KELURAHAN;
                        ViewBag.listPropinsi = Propinsi.getObjectOptions(oCon, "html", oKodepos.PROPINSI);
                        ViewBag.listKabupaten = Kabupaten.getObjectOptions(oCon, oKodepos.PROPINSI, "html", oKodepos.KABUPATEN);
                        ViewBag.listKecamatan = Kecamatan.getObjectOptions(oCon, oKodepos.KABUPATEN, "html", oKodepos.KECAMATAN);
                        ViewBag.modify_status = "UPD";
                        isValid = true;
                    }
                    else
                    {
                        isValid = true;
                    }
                }
                else
                {
                    isValid = true;
                }
            
            }
            catch (Exception ex)
            {
                Utils.WriteLog("Error Message : \r\n" + ex.Message, "KodeposController", "PopUpForm");
            }

            ViewBag.mode = ViewBag.modify_status;

            if (isValid)
            {
                return View("../Kodepos/PopUpForm", "_Blank", null);
            }
            else
            {
                return View("../Common/WarningPopUpForm", "_Blank", null);
            }
        }

        [HttpPost]
        public ActionResult Read(FormCollection collection)
        {
            String strObjectList = "";

            try
            {
                oCon = Database.OpenSqlConnection("");

                strObjectList = Kodepos.getObjectList(oCon, "json");
            }
            catch (Exception ex)
            {
                Utils.WriteLog("Error Message : \r\n" + ex.Message, "KodeposController", "Read");
            }

            ViewBag.response = strObjectList;

            return View("../Common/Custom", "_Blank", null);

        }

        [HttpPost]
        public ActionResult GetOptionKabupaten(FormCollection collection)
        {
            String strObjectList = "";

            try
            {
                oCon = Database.OpenSqlConnection("");
                
                strObjectList = Kabupaten.getObjectOptions(oCon, collection["id"].ToString(), "html", "");
            }
            catch (Exception ex)
            {
                Utils.WriteLog("Error Message : \r\n" + ex.Message, "KodeposController", "GetOptionKabupaten");
            }

            ViewBag.response = strObjectList;

            return View("../Common/Custom", "_Blank", null);

        }
        [HttpPost]
        public ActionResult GetOptionKecamatan(FormCollection collection)
        {
            String strObjectList = "";

            try
            {
                oCon = Database.OpenSqlConnection("");

                strObjectList = Kecamatan.getObjectOptions(oCon, collection["id"].ToString(), "html", "");
            }
            catch (Exception ex)
            {
                Utils.WriteLog("Error Message : \r\n" + ex.Message, "KodeposController", "GetOptionKecamatan");
            }

            ViewBag.response = strObjectList;

            return View("../Common/Custom", "_Blank", null);

        }
    }
}
