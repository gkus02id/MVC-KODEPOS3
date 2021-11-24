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
    public class KabupatenController : Controller
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
            ViewBag.menuTitle = "Kabupaten";
            ViewBag.menuDescription = "...";
            ViewBag.module = "apps";
            ViewBag.subModule = "Kodepos";
            ViewBag.themes = "default";
            ViewBag.urlModule = "javascript:fnLoadingForm('/kabupaten')";
            
            return View("../Common/Custom", "_Blank", null);
        }

        public ActionResult Delete(String id)
        {
            output = new OutputModels();
            output.code = "0";

            try
            {
                oCon = Database.OpenSqlConnection("");

                output.code = Kabupaten.Delete(oCon, Utils.convertParam(Security.shield(id)));
            }
            catch (Exception ex)
            {
                Utils.WriteLog("Error Message : \r\n" + ex.Message, "KabupatenController", "Delete");
            }

            ViewBag.response = JsonConvert.SerializeObject(output);

            return View("../Common/Custom", "_Blank", null);
        }

        [HttpPost]
        public ActionResult PopUpForm(FormCollection collection, String id)
        {
            Boolean isValid = false;

            ViewBag.modify_status = "INS";
            ViewBag.autonumber = "0";
            ViewBag.nama = "";
            ViewBag.propinsiId = "";
            ViewBag.propinsi = "";
            ViewBag.listData = "";
            output = new OutputModels();

            try
            {
                oCon = Database.OpenSqlConnection("");

                if (!String.IsNullOrEmpty(collection["propinsi_id"].ToString()))
                {
                    ViewBag.propinsiId = collection["propinsi_id"].ToString();
                    ViewBag.propinsi = Propinsi.getName(oCon, collection["propinsi_id"].ToString());
                }

                String strObjectList = Kabupaten.getObjectList(oCon, "dataListKabupaten", ViewBag.propinsiId, "html");

                ViewBag.listData = strObjectList;

                if (!String.IsNullOrEmpty(id))
                {
                    KabupatenModels oKabupaten = Kabupaten.getChoosenObject(oCon, Security.shield(id.ToString()));

                    if (oKabupaten != null)
                    {
                        ViewBag.autonumber = oKabupaten.ID;
                        ViewBag.nama = oKabupaten.NAMA;
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
                Utils.WriteLog("Error Message : \r\n" + ex.Message, "PropinsiController", "PopUpForm");
            }

            ViewBag.mode = ViewBag.modify_status;

            if (isValid)
            {
                if (ViewBag.autonumber == "0")
                {
                    if (collection["new_form"] != null && collection["new_form"].ToString() == "1")
                    {
                        return View("../Kabupaten/PopUpEdiForm", "_Blank", null);
                    }
                    else
                    {
                        return View("../Kabupaten/PopUpForm", "_Blank", null);
                    }
                }
                else
                {
                    return View("../Kabupaten/PopUpEditForm", "_Blank", null);
                }
            }
            else
            {
                output.code = "0";
                output.locked_by = ViewBag.locked_by;
                output.locked_date = ViewBag.locked_date;

                ViewBag.response = JsonConvert.SerializeObject(output);

                return View("../Common/Custom", "_Blank", null);
            }

        }

        [HttpPost]
        public ActionResult ReadList(FormCollection collection)
        {
            String strObjectList = "";

            try
            {
                oCon = Database.OpenSqlConnection("");

                strObjectList = Kabupaten.getObjectList(oCon, "dataListKabupaten", collection["propinsi_id"].ToString(), "html");
            }
            catch (Exception ex)
            {
                Utils.WriteLog("Error Message : \r\n" + ex.Message, "KabupatenController", "ReadList");
            }

            ViewBag.response = strObjectList;

            return View("../Common/Custom", "_Blank", null);

        }

        [HttpPost]
        public ActionResult Read(FormCollection collection)
        {
            String strObjectList = "";

            try
            {
                oCon = Database.OpenSqlConnection("");

                strObjectList = Kabupaten.getObjectOptions(oCon, collection["propinsi_id"].ToString(), "html", "");
            }
            catch (Exception ex)
            {
                Utils.WriteLog("Error Message : \r\n" + ex.Message, "KabupatenController", "Read");
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
                Utils.WriteLog("Error Message : \r\n" + ex.Message, "KabupatenController", "GetOptionKabupaten");
            }

            ViewBag.response = strObjectList;

            return View("../Common/Custom", "_Blank", null);

        }
      
    }
}
