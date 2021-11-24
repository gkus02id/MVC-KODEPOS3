using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Data;
using System.Data.SqlClient;

namespace afsys.Classes
{
    public static class Database
    {
        public static void CloseSqlConnection(SqlConnection oCon)
        {
            oCon.Close();
            oCon.Dispose();
            SqlConnection.ClearPool(oCon);
        }

        public static SqlConnection OpenSqlConnection(string conStr, string customVar = "")
        {
            SqlConnection oCon = null;
            String dbConStr = "";
            String vConDBCounter = "oConDbCounter";
            String vOConDb = "oConDb";
            Boolean isCreateConDb = true;
            int oConDbNCounter = 0;
            int nTimeEachConnection = 1000;

            if (!String.IsNullOrEmpty(customVar))
            {
                vConDBCounter += customVar;
                vOConDb += customVar;
            }

            if (HttpContext.Current.Session[vConDBCounter] != null)
            {
                oConDbNCounter = Int32.Parse(HttpContext.Current.Session[vConDBCounter].ToString());
            }

            if (String.IsNullOrEmpty(conStr))
            {
                dbConStr = Utils.getDBConnectionString();
            }
            else
            {
                dbConStr = conStr;
            }

            try
            {
                if (HttpContext.Current.Session[vOConDb] == null) oConDbNCounter = 0;

                if (HttpContext.Current.Session[vOConDb] != null && HttpContext.Current.Session[vOConDb].GetType().Equals(typeof(SqlConnection)))
                {

                    if (oConDbNCounter > nTimeEachConnection)
                    {
                        CloseSqlConnection((SqlConnection)HttpContext.Current.Session[vOConDb]);
                        HttpContext.Current.Session[vOConDb] = null;
                        oConDbNCounter = 0;
                    }
                    else
                    {
                        isCreateConDb = false;

                        oCon = (SqlConnection)HttpContext.Current.Session[vOConDb];

                        if (oCon.State != ConnectionState.Open)
                        {
                            oCon.Close();
                            oCon.Open();
                        }

                        oConDbNCounter++;

                        HttpContext.Current.Session[vConDBCounter] = oConDbNCounter.ToString();
                    }
                }

                if (isCreateConDb)
                {

                    oCon = new SqlConnection(dbConStr);

                    oCon.Open();

                    oConDbNCounter++;

                    HttpContext.Current.Session[vOConDb] = oCon;
                    HttpContext.Current.Session[vConDBCounter] = oConDbNCounter.ToString();
                }
            }
            catch (Exception ex)
            {
                oCon = null;
                Utils.WriteLog("Error Message : \r\n" + ex.Message + "\r\nConnection String :\r\n" + conStr, "Database", "OpenSqlConnection");
            }

            return oCon;
        }

        public static DataTable doQueryDataTable(SqlConnection oCon, String query)
        {
            DataTable oDataTable = new DataTable();

            if (!String.IsNullOrEmpty(query))
            {
                try
                {
                    SqlCommand cmdQuery = new SqlCommand(query, oCon);
                    cmdQuery.CommandTimeout = 120;
                    using (SqlDataReader osQuery = cmdQuery.ExecuteReader())
                    {
                        if (osQuery.HasRows)
                        {
                            oDataTable.Load(osQuery);
                        }
                    }
                }
                catch (Exception ex)
                {
                    oDataTable = null;
                    Utils.WriteLog("Error Message : \r\n" + ex.Message + "\r\nExecute Query :\r\n" + query, "Database", "doQUeryDataTable");
                }
            }

            return oDataTable;
        }

        public static SqlDataReader doQuery(SqlConnection oCon, String query)
        {
            SqlDataReader osQuery = null;

            if (!String.IsNullOrEmpty(query))
            {
                try
                {
                    SqlCommand cmdQuery = new SqlCommand(query, oCon);
                    cmdQuery.CommandTimeout = 120;
                    osQuery = cmdQuery.ExecuteReader();
                }
                catch (Exception ex)
                {
                    osQuery = null;
                    Utils.WriteLog("Error Message : \r\n" + ex.Message + "\r\nExecute Query :\r\n" + query, "Database", "doQuery");
                }
            }

            return osQuery;
        }

        public static Boolean executeQuery(SqlConnection oCon, String query, ref String message)
        {
            Boolean result = false;
            if (!String.IsNullOrEmpty(query))
            {
                try
                {
                    SqlCommand cmdQuery = new SqlCommand(query, oCon);
                    cmdQuery.CommandTimeout = 120;
                    if (cmdQuery.ExecuteNonQuery() > 0)
                    {
                        result = true;
                    }
                }
                catch (Exception ex)
                {
                    message = ex.Message;
                    Utils.WriteLog("Error Message : \r\n" + ex.Message + "\r\nExecute Query :\r\n" + query, "Database", "executeQuery");
                }
            }
            return result;
        }

        public static Boolean executeInsert(SqlConnection oCon, String query, ref String message, ref int newRecordId)
        {
            Boolean result = false;
            if (!String.IsNullOrEmpty(query))
            {
                try
                {
                    SqlCommand cmdQuery = new SqlCommand(query, oCon);
                    cmdQuery.CommandTimeout = 120;

                    newRecordId = (int)cmdQuery.ExecuteScalar();

                    if (newRecordId > 0)
                    {
                        result = true;
                    }
                }
                catch (Exception ex)
                {
                    message = ex.Message;
                    Utils.WriteLog("Error Message : \r\n" + ex.Message + "\r\nExecute Query :\r\n" + query, "Database", "executeQuery");
                }
            }
            return result;
        }
    }
}