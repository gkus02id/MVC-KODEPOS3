using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using System.Security.Cryptography;
using System.Text;
using System.IO;
using Newtonsoft.Json;
using System.Web.SessionState;
using afsys.Models;

namespace afsys.Classes
{
    public static class Security
    {
        public static String shield(String value)
        {
            String result = HttpUtility.HtmlEncode(value);
            result = result.Replace("'", "").Replace("..", "").Replace("/", "").Replace("%20", "").Replace("__", "").Replace("document.cookie", "").Replace("alert(*)", "");
            return result;
        }

        public static String Login(SqlConnection oCon, String username, String password)
        {
            OutputModels output;

            output = new OutputModels();
            output.code = "0";
            output.message = "";
            output.option = "";

            try
            {
                using (DataTable oDataTable = Database.doQueryDataTable(oCon, "SELECT id FROM MS_USER WITH(NOLOCK) WHERE USERNAME = '" + username + "' AND PASSWORD = HASHBYTES('SHA1', '" + password + "')"))
                {
                    if (oDataTable.Rows.Count > 0)
                    {
                        foreach (DataRow row in oDataTable.Rows)
                        {
                            if (!String.IsNullOrEmpty(row["id"].ToString()))
                            {
                                output.code = "1";
                                output.message = "";
                                HttpContext.Current.Session["user-id"] = row["id"].ToString();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Utils.WriteLog("Error Message : \r\n" + ex.Message + "\r\nusername Param : " + username, "Security", "Login");
            }

            if (output.code == "0")
            {
                output.message = "Akun salah";
            }
            

            return JsonConvert.SerializeObject(output);
        }
        
        public static String isUserLogin()
        {
            String result = "0";
            if (HttpContext.Current.Session["user-id"] != null && !String.IsNullOrEmpty(HttpContext.Current.Session["user-id"].ToString()))
            {
                result = "1";
            }
            return result;
        }
        
    }
}