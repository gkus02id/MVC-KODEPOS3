using System;
using System.Globalization;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using afsys.Models;
using System.Threading;
using System.Threading.Tasks;

namespace afsys.Classes
{
    public class Propinsi
    {
        public static String getName(SqlConnection oCon, String filterBy)
        {
            String nama = "";

            String sqlSelect = "SELECT a.NAMA "
                                + "FROM MS_PROPINSI AS a WITH (NOLOCK) "
                                + "WHERE a.ID = " + filterBy;

            using (DataTable oDataTable = Database.doQueryDataTable(oCon, sqlSelect))
            {
                if (oDataTable.Rows.Count > 0)
                {
                    foreach (DataRow oResult in oDataTable.Rows)
                    {
                        nama = oResult["NAMA"].ToString();
                    }
                }
            }

            return nama;
        }

        public static String Delete(SqlConnection oCon, String id)
        {
            String sqlSelect;
            String code = "0";
            bool isValidDelete = false;
            String message = "";

            try
            {
                sqlSelect = "SELECT COUNT(1) AS NRECORD FROM MS_KABUPATEN WITH (NOLOCK) WHERE PROPINSI_ID = " + id;

                using (DataTable dtResult = Database.doQueryDataTable(oCon, sqlSelect))
                {
                    if (dtResult.Rows.Count > 0)
                    {
                        foreach (DataRow row in dtResult.Rows)
                        {
                            if (int.Parse(row["NRECORD"].ToString()) == 0)
                            {
                                isValidDelete = true;
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Utils.WriteLog("Error Message : \r\n" + ex.Message + "\r\nformat ID : " + id, "Propinsi", "Delete");
            }

            if (isValidDelete)
            {
                if (Database.executeQuery(oCon, "DELETE FROM MS_PROPINSI WHERE ID = " + id, ref message))
                {
                    code = "1";
                }
            }

            return code;
        }

        public static String getObjectList(SqlConnection oCon, String gridId, String format = "html")
        {
            String sqlSelect;
            String urlEdit = "";
            String urlDelete = "";
            String customTextLink = "View";
            String tableId = "dataListPropinsi";
            StringBuilder strResult = new StringBuilder();
            DataTable dtResult = new DataTable();
            String fieldKey;
          
            try
            {
                sqlSelect = "SELECT ID, NAMA AS PROPINSI FROM MS_PROPINSI WITH (NOLOCK) ORDER BY NAMA";

                using (SqlDataReader oResult = Database.doQuery(oCon, sqlSelect))
                {
                    if (format == "html") strResult.Append("<table id=\"" + tableId + "\" class=\"table table-hover\"><thead><tr>");

                    int numFields = oResult.FieldCount;

                    for (int i = 1; i < numFields; i++)
                    {
                        if (format == "html") strResult.Append("<th id='" + gridId + "_th_" + i.ToString() + "'>" + oResult.GetName(i) + "</th>");
                    }

                    if (format == "html")
                    {
                        strResult.Append("<th id='" + gridId + "_th_link'> &nbsp;</th>"
                                         + "</tr></thead><tbody>");
                    }

                    if (oResult.HasRows)
                    {
                        dtResult.Load(oResult);
                    }
                }

                int nRecord = 0;
                if (dtResult != null)
                {
                    if (dtResult.Rows.Count > 0)
                    {
                        int p = 0;

                        foreach (DataRow row in dtResult.Rows)
                        {
                            p = 0;

                            if (format == "html") strResult.Append("<tr>");
                            if (format == "json" && nRecord > 0) strResult.Append(",");
                            fieldKey = "";


                            foreach (DataColumn col in dtResult.Columns)
                            {
                                if (format == "json" && p > 1) strResult.Append(",");

                                if (p == 0)
                                {
                                    fieldKey = row[col.ColumnName].ToString();
                                }
                                else if (p == 1)
                                {
                                    if (format == "html") strResult.Append("<td class=\"DTCOL_" + col.ColumnName.ToString().ToUpper().Replace(" ", "_") + "\" > " + row[col.ColumnName].ToString() + "</td>");
                                    if (format == "json") strResult.Append("{");
                                }
                                else
                                {
                                    if (format == "html") strResult.Append("<td class=\"DTCOL_" + col.ColumnName.ToString().ToUpper().Replace(" ", "_") + "\">" + row[col.ColumnName].ToString() + "</td>");
                                }

                                if (format == "json" && p > 0) strResult.Append("\"" + col.ColumnName + "\" : \"" + Utils.converToJSon(row[col.ColumnName].ToString()) + "\"");

                                p++;
                            }

                            urlEdit = "editpropinsi" + "_" + fieldKey;
                            urlDelete = "deletepropinsi_" + fieldKey;

                            if (format == "html")
                            {
                                strResult.Append("<td class=\"DTCOL_ACTION\">");
                                strResult.Append("<a href=\"#\" onclick=\"event.preventDefault();coreLoadRecord('" + urlEdit + "')\"><i class=\"fa fa-edit\"></i>&nbsp;edit</a>");
                                strResult.Append("&nbsp;|&nbsp;");
                                strResult.Append("<a href=\"#\" onclick=\"event.preventDefault();coreDeleteRecord('" + urlDelete + "','')\"><i class=\"fa fa-trash-o\"></i>&nbsp;delete</a>");

                                strResult.Append("</td></tr>");
                            }

                            if (format == "json")
                            {
                                strResult.Append(",\"edit_url\":\"" + urlEdit + "\"");
                                strResult.Append(",\"delete_url\":\"" + urlDelete + "\"");
                                strResult.Append("}");
                            }

                            nRecord++;

                            if (nRecord % 10 == 0) Thread.Sleep(10);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Utils.WriteLog("Error Message : \r\n" + ex.Message + "\r\nformat Param : " + format, "Propinsi", "getObjectList");
            }
            finally
            {
                dtResult.Dispose();
            }

            if (format == "json" && strResult.Length > 0)
            {
                return "{\"jsonobject\" : [" + strResult.ToString() + "]}";
            }
            else
            {
                if (strResult.Length > 0 && format == "html") strResult.Append("</tbody></table>");

                return strResult.ToString();
            }
        }

        public static PropinsiModels getChoosenObject(SqlConnection oCon, String filterBy)
        {
            PropinsiModels oPropinsi = new PropinsiModels();

            String sqlSelect = "SELECT a.ID, a.NAMA "
                                + "FROM MS_PROPINSI AS a WITH (NOLOCK) "
                                + "WHERE a.ID = " + filterBy;

            using (DataTable oDataTable = Database.doQueryDataTable(oCon, sqlSelect))
            {
                if (oDataTable.Rows.Count > 0)
                {
                    foreach (DataRow oResult in oDataTable.Rows)
                    {
                        oPropinsi.ID = filterBy;
                        oPropinsi.NAMA = oResult["NAMA"].ToString();
                    }
                }
            }

            return oPropinsi;
        }

        public static String getUniqueObject(SqlConnection oCon, String systemId, String filterBy)
        {
            String result = "0";
            String sqlSelect = "SELECT ID, NAMA FROM MS_PROPINSI WITH (NOLOCK) " + filterBy;
            
            using (DataTable oDataTable = Database.doQueryDataTable(oCon, sqlSelect))
            {
                if (oDataTable.Rows.Count > 0)
                {
                    foreach (DataRow oResult in oDataTable.Rows)
                    {
                        if (!oResult["ID"].ToString().Equals(systemId))
                        {
                            result = "1";
                        }
                    }
                }
            }

            return result;
        }

        public static String getObjectOptions(SqlConnection oCon, String format = "html", String oValue = "", Boolean includeEmptyOption = true)
        {
            String sqlSelect;
            StringBuilder strResult = new StringBuilder();
           
            try
            {
                sqlSelect = "SELECT ID, NAMA FROM MS_PROPINSI WITH (NOLOCK) ORDER BY NAMA";
                
                if (format == "html" && includeEmptyOption)
                {
                    strResult.Append("<option value='' ");
                    if (oValue == "") strResult.Append(" selected ");
                    strResult.Append("> pilih ...</option>" + "\r\n");
                }

                using (DataTable dtResult = Database.doQueryDataTable(oCon, sqlSelect))
                {
                    int nRecord = 0;

                    if (dtResult.Rows.Count > 0)
                    {
                        int p = 0;
                        String col0Name = "";
                        String col1Name = "";

                        foreach (DataRow row in dtResult.Rows)
                        {
                            if (nRecord == 0)
                            {
                                foreach (DataColumn col in dtResult.Columns)
                                {
                                    if (p == 0) col0Name = col.ColumnName;
                                    if (p == 1) col1Name = col.ColumnName;
                                    p++;
                                }
                            }

                            if (format == "json" && nRecord > 0) strResult.Append(",");
                            if (format == "html")
                            {
                                strResult.Append("<option value='" + row[col0Name].ToString() + "' ");
                                if (oValue.ToString() == row[col0Name].ToString()) strResult.Append(" selected ");
                                strResult.Append("> " + row[col1Name].ToString() + "</option>" + "\r\n");
                            }
                            if (format == "json") strResult.Append("{\"id\":\"" + row[col0Name].ToString() + "\", \"value\":\"" + row[col1Name].ToString() + "\"}");

                            nRecord++;

                            if (nRecord % 10 == 0) Thread.Sleep(10);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Utils.WriteLog("Error Message : \r\n" + ex.Message + 
                               "\r\nformat Param : " + format, "Propinsi", "getObjectOptions");
            }

            if (format == "json" && strResult.Length > 0)
            {
                return "{\"jsonobject\" : [" + strResult.ToString() + "]}";
            }
            else
            {
                return strResult.ToString();
            }
        }
    }
}