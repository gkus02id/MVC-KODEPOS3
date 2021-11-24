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
    public class Kodepos
    {
        
        public static String getObjectList(SqlConnection oCon, String format = "html")
        {
            String sqlSelect;
            String urlEdit = "";
            String urlDelete = "";
            String customTextLink = "View";
            String tableId = "dataList";
            StringBuilder strResult = new StringBuilder();
            DataTable dtResult = new DataTable();
            String fieldKey;
            String gridId = "lkodepos";
            
           
            try
            {
                sqlSelect = "SELECT a.ID as AUTONUMBER, a.ID, a.KODEPOS, a.KELURAHAN, b.NAMA AS KECAMATAN, c.NAMA AS KABUPATEN, d.NAMA AS PROPINSI "
                            + "FROM MS_KODEPOS AS a WITH (NOLOCK) "
                            + "JOIN MS_KECAMATAN AS b WITH (NOLOCK) "
                            + "ON b.ID = a.KECAMATAN_ID "
                            + "JOIN MS_KABUPATEN AS c WITH (NOLOCK) "
                            + "ON c.ID = b.KABUPATEN_ID "
                            + "JOIN MS_PROPINSI AS d  WITH (NOLOCK) "
                            + "ON d.ID = c.PROPINSI_ID "
                            + "ORDER BY d.NAMA, c.NAMA, b.NAMA, a.KODEPOS ";

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

                            urlEdit = "editkodepos" + "_" + fieldKey;
                            urlDelete = "deletekodepos_" + fieldKey;

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
                Utils.WriteLog("Error Message : \r\n" + ex.Message + "\r\nformat Param : " + format, "Kodepos", "getObjectList");
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

        public static String getName(SqlConnection oCon, String itemId)
        {
            String pName = "";

            if (!String.IsNullOrEmpty(itemId))
            {
                using (DataTable oDataTable = Database.doQueryDataTable(oCon, "select isnull(product_code,'') as code, isnull(short_name,'') as name from AF0105 with (nolock) where autonumber = " + itemId))
                {
                    if (oDataTable.Rows.Count > 0)
                    {
                        foreach (DataRow oResult in oDataTable.Rows)
                        {
                            if (!String.IsNullOrEmpty(oResult["name"].ToString()))
                            {
                                pName = oResult["code"].ToString() + " - " + oResult["name"].ToString();
                            }
                            else
                            {
                                pName = oResult["code"].ToString();
                            }
                        }
                    }
                }
            }

            return pName;
        }

        public static KodeposModels getChoosenObject(SqlConnection oCon, String filterBy)
        {
            KodeposModels oKodepos = new KodeposModels();

            String sqlSelect = "SELECT a.ID, a.KODEPOS, a.KELURAHAN, a.KECAMATAN_ID AS KECAMATAN, b.KABUPATEN_ID AS KABUPATEN, c.PROPINSI_ID AS PROPINSI "
                                + "FROM MS_KODEPOS AS a WITH (NOLOCK) "
                                + "JOIN MS_KECAMATAN AS b WITH (NOLOCK) "
                                + "ON b.ID = a.KECAMATAN_ID "
                                + "JOIN MS_KABUPATEN AS c WITH (NOLOCK) "
                                + "ON c.ID = b.KABUPATEN_ID "
                                + "WHERE a.ID = " + filterBy;

            using (DataTable oDataTable = Database.doQueryDataTable(oCon, sqlSelect))
            {
                if (oDataTable.Rows.Count > 0)
                {
                    foreach (DataRow oResult in oDataTable.Rows)
                    {
                        oKodepos.ID = filterBy;
                        oKodepos.KODEPOS = oResult["KODEPOS"].ToString();
                        oKodepos.KELURAHAN = oResult["KELURAHAN"].ToString();
                        oKodepos.KECAMATAN = oResult["KECAMATAN"].ToString();
                        oKodepos.KABUPATEN = oResult["KABUPATEN"].ToString();
                        oKodepos.PROPINSI = oResult["PROPINSI"].ToString();
                    }
                }
            }

            return oKodepos;
        }
        
        /*
        public static String getObjectList(SqlConnection oCon, String fileName = "", String xmlNode = "", String aliasNode = "", String format = "html", Boolean isEnabledEditLink = true, Boolean isEnabledDeleteLink = false, String condition = "", String gridId = "", Boolean isHaveLinkEdit2 = false, String NumberColumnLinkEdit2 = "", Boolean isEnabledCustomLink = false, String labelCustomLink = "")
        {
            String xmlQuery;
            String urlEdit = "";
            String urlDelete = "";
            String urlCustom = "";
            String fieldValue = "";
            String customTextLink = "View";
            String tableId = "dataList";
            StringBuilder strResult = new StringBuilder();
            DataTable dtResult = new DataTable();
            String fieldKey;
            String fieldLinkEdit2;

            if (!String.IsNullOrEmpty(gridId)) tableId = gridId;

            try
            {
                xmlQuery = Utils.getQuery(fileName, xmlNode);
                xmlQuery = xmlQuery.Replace("FILTER_BY_PROGRAM", condition);

                using (SqlDataReader oResult = Database.doQuery(oCon, xmlQuery))
                {
                    if (format == "html") strResult.Append("<table id=\"" + tableId + "\" class=\"table table-hover\"><thead><tr>");

                    int numFields = oResult.FieldCount;

                    for (int i = 1; i < numFields; i++)
                    {
                        if (format == "html") strResult.Append("<th id='" + gridId + "_th_" + i.ToString() + "'>" + oResult.GetName(i) + "</th>");
                    }

                    //tambahan jika tidak ada edit dan delete link
                    if (format == "html" && (isEnabledEditLink || isEnabledDeleteLink || isEnabledCustomLink))
                    {
                        strResult.Append("<th id='" + gridId + "_th_link'> &nbsp;</th>"
                                         + "</tr></thead><tbody>");
                    }
                    else if (format == "html" && !isEnabledEditLink && !isEnabledDeleteLink && !isEnabledCustomLink)
                    {
                        strResult.Append("</tr></thead><tbody>");
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
                            fieldLinkEdit2 = "";

                            foreach (DataColumn col in dtResult.Columns)
                            {
                                if (format == "json" && p > 1) strResult.Append(",");
                                
                                if (col.ColumnName.ToString().ToUpper() == "PRICE")
                                {
                                    fieldValue = String.Format(CultureInfo.InvariantCulture, "{0:N}", Decimal.Parse(row[col.ColumnName].ToString()));
                                }
                                else
                                {
                                    fieldValue = row[col.ColumnName].ToString();
                                }
                                
                                if (p == 0)
                                {
                                    fieldKey = row[col.ColumnName].ToString();
                                }
                                else if (p == 1)
                                {
                                    if (format == "html") strResult.Append("<td class=\"DTCOL_" + col.ColumnName.ToString().ToUpper().Replace(" ", "_") + "\" > " + fieldValue + "</td>");
                                    if (format == "json") strResult.Append("{");
                                }
                                else
                                {
                                    if (format == "html") strResult.Append("<td class=\"DTCOL_" + col.ColumnName.ToString().ToUpper().Replace(" ", "_") + "\">" + fieldValue + "</td>");
                                }

                                if (format == "json" && p > 0) strResult.Append("\"" + col.ColumnName + "\" : \"" + Utils.converToJSon(fieldValue) + "\"");

                                if (isHaveLinkEdit2)
                                {
                                    if (p == Convert.ToInt32(NumberColumnLinkEdit2))
                                    {
                                        fieldLinkEdit2 = row[col.ColumnName].ToString();
                                    }
                                }

                                p++;
                            }

                            if (!String.IsNullOrEmpty(aliasNode))
                            {
                                urlEdit = "edit" + aliasNode + "_" + fieldKey;
                                urlCustom = "custom" + aliasNode + "_" + fieldKey;
                                if (isHaveLinkEdit2)
                                {
                                    urlEdit = urlEdit + "_" + fieldLinkEdit2;
                                }
                            }
                            else
                            {
                                urlEdit = "edit" + xmlNode + "_" + fieldKey;
                                urlCustom = "custom" + xmlNode + "_" + fieldKey;
                                if (isHaveLinkEdit2)
                                {
                                    urlEdit = urlEdit + "_" + fieldLinkEdit2;
                                }
                            }

                            if (isEnabledDeleteLink)
                            {
                                if (!String.IsNullOrEmpty(aliasNode))
                                {
                                    urlDelete = "delete_" + aliasNode + "_" + fieldKey;
                                }
                                else
                                {
                                    urlDelete = "delete_" + xmlNode + "_" + fieldKey;
                                }
                            }

                            if (format == "html" && (isEnabledEditLink || isEnabledDeleteLink || isEnabledCustomLink))
                            {
                                strResult.Append("<td class=\"DTCOL_ACTION\">");
                                if (isEnabledEditLink) strResult.Append("<a href=\"#\" onclick=\"event.preventDefault();coreLoadRecord('" + urlEdit + "')\"><i class=\"fa fa-edit\"></i>&nbsp;edit</a>");
                                if (isEnabledDeleteLink)
                                {
                                    if (isEnabledEditLink) strResult.Append("&nbsp;|&nbsp;");
                                    strResult.Append("<a href=\"#\" onclick=\"event.preventDefault();coreDeleteRecord('" + urlDelete + "','" + aliasNode + "')\"><i class=\"fa fa-trash-o\"></i>&nbsp;delete</a>");
                                }

                                if (isEnabledCustomLink)
                                {
                                    if (isEnabledEditLink || isEnabledDeleteLink) strResult.Append("&nbsp;|&nbsp;");
                                    if (!String.IsNullOrEmpty(labelCustomLink)) customTextLink = labelCustomLink;
                                    strResult.Append("<a href=\"#\" onclick=\"event.preventDefault();coreCustomLoadRecord('" + urlCustom + "')\"><i class=\"fa fa-trash-o\"></i>&nbsp;" + customTextLink + "</a>");
                                }

                                strResult.Append("</td></tr>");
                            }
                            //tambahan jika format html tp tidak ada edit dan delete link
                            else if (format == "html" && !isEnabledEditLink && !isEnabledDeleteLink && !isEnabledCustomLink)
                            {
                                strResult.Append("</tr>");
                            }

                            if (format == "json")
                            {
                                if (isEnabledEditLink) strResult.Append(",\"edit_url\":\"" + urlEdit + "\"");
                                if (isEnabledDeleteLink) strResult.Append(",\"delete_url\":\"" + urlDelete + "\"");
                                if (isEnabledCustomLink) strResult.Append(",\"custom_url\":\"" + urlCustom + "\"");
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
                Utils.WriteLog("Error Message : \r\n" + ex.Message + "\r\nfileName Param : " + fileName + "\r\nxmlNode Param : " + xmlNode +
                               "\r\naliasNode Param : " + aliasNode + "\r\nformat Param : " + format, "ObjectCollection", "getObjectList");
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
        */

        public static void syncItemPrice(SqlConnection oCon, String price, String filterBy)
        {
            String errorMessage = "";
            Database.executeQuery(oCon, "UPDATE AF0105 SET UNIT_PRICE = " + price + " WHERE AUTONUMBER = "  + filterBy, ref errorMessage);
        }

        public static String getUniqueObject(SqlConnection oCon, String systemId, String filterBy)
        {
            String result = "0";
            String sqlFromXml = Utils.getQuery("web_request_master_af", "AF0105_get");
            sqlFromXml = sqlFromXml.Replace("CUSTOM_FIELD_BY_PROGRAM", "");
            String sqlSelect = sqlFromXml.Replace("FILTER_BY_PROGRAM", filterBy);

            using (DataTable oDataTable = Database.doQueryDataTable(oCon, sqlSelect))
            {
                if (oDataTable.Rows.Count > 0)
                {
                    foreach (DataRow oResult in oDataTable.Rows)
                    {
                        if (!oResult["AUTONUMBER"].ToString().Equals(systemId))
                        {
                            result = "1";
                        }
                    }
                }
            }

            return result;
        }

        public static String getOptionDiscountinue(String eValue)
        {
            StringBuilder strResult = new StringBuilder();

            strResult.Append("<option value = \"\" ");
            if (eValue.ToUpper().Equals("")) strResult.Append(" selected ");
            strResult.Append("></option>");

            strResult.Append("<option value = \"NO\" ");
            if (eValue.ToUpper().Equals("NO")) strResult.Append(" selected ");
            strResult.Append(">NO</option>");

            strResult.Append("<option value = \"YES\" ");
            if (eValue.ToUpper().Equals("YES")) strResult.Append(" selected ");
            strResult.Append(">YES</option>");

            return strResult.ToString();                            
        }

        public static String getItemOptions(SqlConnection oCon, String oValue = "")
        {
            StringBuilder strResult = new StringBuilder();

            try
            {
                using (DataTable dtResult = Database.doQueryDataTable(oCon, "select autonumber as id, isnull(short_name,'') as name from AF0105 with (nolock) where isnull(record_status,'') <> 'd' order by short_name"))
                {
                    foreach (DataRow row in dtResult.Rows)
                    {
                        strResult.Append("<option value='" + row["id"].ToString() + "' ");
                        if (oValue.ToString() == row["id"].ToString()) strResult.Append(" selected ");
                        strResult.Append(">" + row["name"].ToString() + "</option>" + "\r\n");
                    }
                }
            }
            catch (Exception ex)
            {
            }

            return strResult.ToString();
        }

        public static String getObjectOptions(SqlConnection oCon, String fileName = "", String xmlNode = "", String condition = "", String format = "html", String oValue = "", Boolean includeEmptyOption = true)
        {
            String xmlQuery;
            StringBuilder strResult = new StringBuilder();
            String strCondition = "";

            try
            {
                xmlQuery = Utils.getQuery(fileName, xmlNode);
                if (!String.IsNullOrEmpty(condition)) strCondition = condition;
                xmlQuery = xmlQuery.Replace("FILTER_BY_PROGRAM", strCondition);

                if (format == "html" && includeEmptyOption)
                {
                    strResult.Append("<option value='' unit_price='' uom='' ");
                    if (oValue == "") strResult.Append(" selected ");
                    strResult.Append("> select...</option>" + "\r\n");
                }

                using (DataTable dtResult = Database.doQueryDataTable(oCon, xmlQuery))
                {
                    int nRecord = 0;

                    if (dtResult.Rows.Count > 0)
                    {
                        int p = 0;
                        String col0Name = "";
                        String col1Name = "";
                        String col2Name = "";
                        String col3Name = "";


                        foreach (DataRow row in dtResult.Rows)
                        {

                            if (nRecord == 0)
                            {
                                foreach (DataColumn col in dtResult.Columns)
                                {
                                    if (p == 0) col0Name = col.ColumnName;
                                    if (p == 1) col1Name = col.ColumnName;
                                    if (p == 2) col2Name = col.ColumnName;
                                    if (p == 3) col3Name = col.ColumnName;
                                    p++;
                                }
                            }

                            if (format == "json" && nRecord > 0) strResult.Append(",");
                            if (format == "html")
                            {
                                strResult.Append("<option value='" + row[col0Name].ToString() + "' " + col2Name + "='" + row[col2Name].ToString() + "' " + col3Name + "='" + row[col3Name].ToString() + "' ");
                                if (oValue.ToString() == row[col0Name].ToString()) strResult.Append(" selected ");
                                strResult.Append(">" + row[col1Name].ToString() + "</option>" + "\r\n");
                            }
                            if (format == "json") strResult.Append("{\"id\":\"" + row[col0Name].ToString() + "\", \"value\":\"" + row[col1Name].ToString() + "\", \"" + col2Name + "\":\"" + row[col2Name].ToString() + "\", \"" + col3Name + "\":\"" + row[col3Name].ToString() + "\"}");

                            nRecord++;

                            if (nRecord % 10 == 0) Thread.Sleep(10);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Utils.WriteLog("Error Message : \r\n" + ex.Message + "\r\nfileName Param : " + fileName + "\r\nxmlNode Param : " + xmlNode +
                               "\r\nformat Param : " + format, "Kodepos", "getObjectOptions");
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