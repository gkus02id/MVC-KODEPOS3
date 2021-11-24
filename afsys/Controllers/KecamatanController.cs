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
    public class KecamatanController : Controller
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
            ViewBag.menuTitle = "Kecamatan";
            ViewBag.menuDescription = "...";
            ViewBag.module = "apps";
            ViewBag.subModule = "Kodepos";
            ViewBag.themes = "default";
            ViewBag.urlModule = "javascript:fnLoadingForm('/kecamatan')";
            
            return View("../Common/Custom", "_Blank", null);
        }

        public ActionResult Delete(String id)
        {
            output = new OutputModels();
            output.code = "0";

            try
            {
                oCon = Database.OpenSqlConnection("");

                output.code = Kecamatan.Delete(oCon, Utils.convertParam(Security.shield(id)));
            }
            catch (Exception ex)
            {
                Utils.WriteLog("Error Message : \r\n" + ex.Message, "KecamatanController", "Delete");
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
            ViewBag.kabupatenId = "";
            ViewBag.kabupaten = "";
            ViewBag.listData = "";
            output = new OutputModels();

            try
            {
                oCon = Database.OpenSqlConnection("");

                if (!String.IsNullOrEmpty(collection["kabupaten_id"].ToString()))
                {
                    ViewBag.kabupatenId = collection["kabupaten_id"].ToString();
                    ViewBag.kabupaten = Propinsi.getName(oCon, collection["kabupaten_id"].ToString());
                }

                String strObjectList = Kecamatan.getObjectList(oCon, "dataListKecamatan", ViewBag.kabupatenId, "html");

                ViewBag.listData = strObjectList;

                if (!String.IsNullOrEmpty(id))
                {
                    KecamatanModels oKecamatan = Kecamatan.getChoosenObject(oCon, Security.shield(id.ToString()));

                    if (oKecamatan != null)
                    {
                        ViewBag.autonumber = oKecamatan.ID;
                        ViewBag.nama = oKecamatan.NAMA;
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
                Utils.WriteLog("Error Message : \r\n" + ex.Message, "KecamatanController", "PopUpForm");
            }

            ViewBag.mode = ViewBag.modify_status;

            
                if (ViewBag.autonumber == "0")
                {
                    if (collection["new_form"] != null && collection["new_form"].ToString() == "1")
                    {
                        return View("../Kecamatan/PopUpEdiForm", "_Blank", null);
                    }
                    else
                    {
                        return View("../Kecamatan/PopUpForm", "_Blank", null);
                    }
                }
                else
                {
                    return View("../Kecamatan/PopUpEditForm", "_Blank", null);
                }
            
        }
        
        [HttpPost]
        public ActionResult Read(FormCollection collection)
        {
            String strObjectList = "";

            try
            {
                oCon = Database.OpenSqlConnection("");

                strObjectList = Kecamatan.getObjectOptions(oCon, collection["kabupaten_id"].ToString(), "html", "");
            }
            catch (Exception ex)
            {
                Utils.WriteLog("Error Message : \r\n" + ex.Message, "KecamatanController", "Read");
            }

            ViewBag.response = strObjectList;

            return View("../Common/Custom", "_Blank", null);

        }

        [HttpPost]
        public ActionResult ReadList(FormCollection collection)
        {
            String strObjectList = "";

            try
            {
                oCon = Database.OpenSqlConnection("");

                strObjectList = Kecamatan.getObjectList(oCon, "dataListPropinsi", collection["kabupaten_id"].ToString(), "html");
            }
            catch (Exception ex)
            {
                Utils.WriteLog("Error Message : \r\n" + ex.Message, "KecamatanController", "ReadList");
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
                Utils.WriteLog("Error Message : \r\n" + ex.Message, "KecamatanController", "Read");
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
                Utils.WriteLog("Error Message : \r\n" + ex.Message, "KecamatanController", "GetOptionKecamatan");
            }

            ViewBag.response = strObjectList;

            return View("../Common/Custom", "_Blank", null);

        }
    }
}
