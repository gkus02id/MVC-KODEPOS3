using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using System.Data;
using System.Data.SqlClient;
using System.Security.Cryptography;
using System.Text;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using afsys.Models;
using afsys.Classes;

namespace afsys.Controllers
{
    [OutputCache(Location = OutputCacheLocation.None, NoStore = true)]
    public class RouterController : Controller
    {
        public SqlConnection oCon;
        public OutputModels output;

        [HttpPost]
        public ActionResult Save(FormCollection collection)
        {
            String oMessage = "";
            String lockFieldValue = "";
            String curDocumentNo = "";
            Int32 isGetAutoNumber = 0;
            Int32 curAutoNumberInsertMode = 0;
            oCon = Database.OpenSqlConnection("");
            output = new OutputModels();

            try
            {
                if (!String.IsNullOrEmpty(collection["jsonobject"]))
                {
                    if (ObjectUpdate.breakJSONObject(oCon, collection["jsonobject"].ToString(), ref oMessage, ref isGetAutoNumber, ref curAutoNumberInsertMode, ref curDocumentNo, ref lockFieldValue, ""))
                    {
                        output.code = "1";
                        output.message = "";
                        if (isGetAutoNumber > 0)
                        {
                            output.message = curAutoNumberInsertMode.ToString();
                            output.option = lockFieldValue.ToString();
                            if (isGetAutoNumber == 2) output.reference = curDocumentNo;
                        }
                    }
                    else
                    {
                        output.code = "0";
                        if (!String.IsNullOrEmpty(oMessage))
                        {
                            if (oMessage.ToLower().Equals("saat ini server sedang menjalankan proses lain, harap save data beberapa saat lagi"))
                            {
                                output.code = "7";
                            }

                            output.message = oMessage;
                        }
                        else
                        {
                            output.message = "Error";
                        }
                    }
                }
                ViewBag.response = JsonConvert.SerializeObject(output);

                Utils.WriteLog(ViewBag.response);
            }
            catch (Exception ex)
            {
                Utils.WriteLog("Error Message : \r\n" + ex.Message + "\r\njsonobject Param : \r\n" + collection["jsonobject"], "Routercaf17Controller", "Save");
            }

            return View("../Common/Custom", "_Blank", null);
        }

        public ActionResult Delete(String tid, String id)
        {
            output = new OutputModels();
            String content = "";
            String oMessage = "";

            try
            {
                oCon = Database.OpenSqlConnection("");
                
                JObject jFieldCollection = JObject.Parse("{\"dt_fieldsCollection\" : [{\"fieldName\":\"AUTONUMBER\", \"fieldValue\":\"" + id + "\", \"fieldType\":\"string\", \"fieldKey\":\"1\"}]}");

                String queryCollection = ObjectUpdate.generateQuery(oCon, "dt_fieldsCollection", jFieldCollection, tid, "", "DEL", 0, 0, "");

                if (Database.executeQuery(oCon, queryCollection, ref oMessage))
                {
                    output.code = "1";
                    output.message = "";
                }
                else
                {
                    output.code = "0";
                    if (!String.IsNullOrEmpty(oMessage))
                    {
                        output.message = oMessage;
                    }
                    else
                    {
                        output.message = "Error";
                    }
                }
                
                ViewBag.response = JsonConvert.SerializeObject(output);
            }
            catch (Exception ex)
            {
                Utils.WriteLog("Error Message : \r\n" + ex.Message, "RouterController", "Delete");
            }

            return View("../Common/Custom", "_Blank", null);
        }
    }
}
