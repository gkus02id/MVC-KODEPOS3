using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using System.Security.Cryptography;
using System.Globalization;
using afsys.Classes;
using Newtonsoft.Json.Linq;

namespace afsys.Classes
{
    public static class ObjectUpdate
    {
        public static Boolean breakJSONObject(SqlConnection oCon, String jSonStr, ref String message, ref int isGetAutoNumber, ref int curAutonumber, ref String curDocumentNo, ref String lockFieldValue, String prefixDb)
        {
            String jSonObjectStr = jSonStr;
            //String relField = "";
            String queryCollection = "";
            Boolean result = false;
            Boolean isValidProcess = true;
            //int relCount = 0;
            String lockTableName = "";
            String lockFieldName = "";
            String jSonLockFieldValue = "";
            String lockOperatorName = "";
            String lockComputerName = "";
            String fieldDocumentNo = "";
            int loopLockProcess = 0;

            try
            {
                jSonObjectStr = jSonObjectStr.Replace("{\"dt_objectTable\":[", "{\"dt_objectTable\":").Replace("{\"dt_relatedTable\":[", "{\"dt_relatedTable\":").Replace("}]}", "}}");

                JObject jSonObject = JObject.Parse(jSonObjectStr);

                /*
                for (int i = 0; i < jSonObject["dt_objectTable"]["dt_relatedTables"].Count(); i++)
                {
                    String relTableName = jSonObject["dt_objectTable"]["dt_relatedTables"][i]["dt_relatedTable"]["tableName"].ToString();
                    String relModifyStatus = jSonObject["dt_objectTable"]["dt_relatedTables"][i]["dt_relatedTable"]["modify_status"].ToString();
                    JObject dtRelfieldCollection = JObject.Parse("{\"dt_relfieldCollection\" : " + jSonObject["dt_objectTable"]["dt_relatedTables"][i]["dt_relatedTable"]["dt_relfieldCollection"].ToString() + "}");
                    queryCollection += generateQuery(oCon, "dt_relfieldCollection", dtRelfieldCollection, relTableName, "", relModifyStatus, relCount);
                    relCount++;
                }
                */

                for (int x = 0; x < jSonObject["dt_objectTable"]["dt_fieldsCollection"].Count(); x++)
                {
                    if (isValidProcess && jSonObject["dt_objectTable"]["dt_fieldsCollection"][x]["fieldType"].ToString() == "string")
                    {
                        if (!Utils.isValidSpecialCharacter(jSonObject["dt_objectTable"]["dt_fieldsCollection"][x]["fieldValue"].ToString()))
                        {
                            isValidProcess = false;
                            message = jSonObject["dt_objectTable"]["dt_fieldsCollection"][x]["fieldName"].ToString() + " field contain not valid character (Ex : ' , \" , \\ , &)";
                        }
                    }
                }

                String tableName = jSonObject["dt_objectTable"]["tableName"].ToString();
                String autonumFormat = jSonObject["dt_objectTable"]["autonumFormat"].ToString();
                String modifyStatus = jSonObject["dt_objectTable"]["modify_status"].ToString();

                if (isValidProcess)
                {
                    if (modifyStatus.Equals("INSPLUS"))
                    {
                        isGetAutoNumber = 1;
                        modifyStatus = "INS";
                    }
                    else if (modifyStatus.IndexOf("INS2PLUS") != -1)
                    {
                        isGetAutoNumber = 2;
                        fieldDocumentNo = modifyStatus.Replace("INS2PLUS_", "");
                        modifyStatus = "INS";
                    }

                    if (modifyStatus == "INS")
                    {
                        for (int x = 0; x < jSonObject["dt_objectTable"]["dt_fieldsCollection"].Count(); x++)
                        {
                            if (jSonObject["dt_objectTable"]["dt_fieldsCollection"][x]["fieldType"].ToString() == "vlt")
                            {
                                switch (jSonObject["dt_objectTable"]["dt_fieldsCollection"][x]["fieldName"].ToString())
                                {
                                    case "LT_NAME":
                                        lockTableName = jSonObject["dt_objectTable"]["dt_fieldsCollection"][x]["fieldValue"].ToString();
                                        break;
                                    case "LT_FNAME":
                                        lockFieldName = jSonObject["dt_objectTable"]["dt_fieldsCollection"][x]["fieldValue"].ToString();
                                        break;
                                    case "LT_OM":
                                        lockOperatorName = jSonObject["dt_objectTable"]["dt_fieldsCollection"][x]["fieldValue"].ToString();
                                        break;
                                    case "LT_CM":
                                        lockComputerName = jSonObject["dt_objectTable"]["dt_fieldsCollection"][x]["fieldValue"].ToString();
                                        break;
                                }
                            }
                        }

                        if (!String.IsNullOrEmpty(lockTableName) && !String.IsNullOrEmpty(lockFieldName) && !String.IsNullOrEmpty(lockOperatorName))
                        {
                            for (int x = 0; x < jSonObject["dt_objectTable"]["dt_fieldsCollection"].Count(); x++)
                            {
                                if (jSonObject["dt_objectTable"]["dt_fieldsCollection"][x]["fieldName"].ToString() == lockFieldName)
                                {
                                    jSonLockFieldValue = jSonObject["dt_objectTable"]["dt_fieldsCollection"][x]["fieldValue"].ToString();
                                }
                            }                           
                        }
                    }

                    if (isValidProcess)
                    {
                        for (int x = 0; x < jSonObject["dt_objectTable"]["dt_fieldsCollection"].Count(); x++)
                        {
                            if (jSonObject["dt_objectTable"]["dt_fieldsCollection"][x]["fieldName"].ToString().IndexOf("dataList") != -1)
                            {
                                jSonObject["dt_objectTable"]["dt_fieldsCollection"][x].Remove();
                            }
                        }

                        JObject jFieldCollection = null;

                        if (!String.IsNullOrEmpty(lockTableName) && !String.IsNullOrEmpty(lockFieldName) && !String.IsNullOrEmpty(lockOperatorName) && !String.IsNullOrEmpty(lockComputerName))
                        {
                            jFieldCollection = JObject.Parse("{\"dt_fieldsCollection\" : " + jSonObject["dt_objectTable"]["dt_fieldsCollection"].ToString().Replace(jSonLockFieldValue, lockFieldValue) + "}");
                        }
                        else
                        {
                            jFieldCollection = JObject.Parse("{\"dt_fieldsCollection\" : " + jSonObject["dt_objectTable"]["dt_fieldsCollection"].ToString() + "}");
                        }

                        queryCollection += generateQuery(oCon, "dt_fieldsCollection", jFieldCollection, tableName, autonumFormat, modifyStatus, 0, isGetAutoNumber, prefixDb);

                        //Utils.WriteLog(queryCollection);

                        if (isGetAutoNumber > 0)
                        {
                            if (Database.executeInsert(oCon, queryCollection, ref message, ref curAutonumber))
                            {
                                if (isGetAutoNumber == 2 && !String.IsNullOrEmpty(curAutonumber.ToString()))
                                {
                                    using (SqlDataReader oResultRef = Database.doQuery(oCon, "SELECT " + fieldDocumentNo + " FROM " + tableName + " WITH (NOLOCK) WHERE AUTONUMBER = " + curAutonumber.ToString()))
                                    {
                                        if (oResultRef != null)
                                        {
                                            while (oResultRef.Read())
                                            {
                                                curDocumentNo = oResultRef[fieldDocumentNo].ToString();
                                            }
                                        }
                                    }
                                }

                                result = true;
                            }
                        }
                        else
                        {
                            if (Database.executeQuery(oCon, queryCollection, ref message))
                            {
                                result = true;
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                if (ex.Message.ToLower().IndexOf("cannot insert duplicate key in object") != -1)
                {
                    message = "error duplicate data";
                }
                else if (ex.Message.ToLower().IndexOf("violation of unique key") != -1)
                {
                    message = "Barcode Sudah Diinput";
                }
                Utils.WriteLog("Error Message : \r\n" + ex.Message + "\r\njSonStr Param : " + jSonStr + "\r\nqueryCollection Variable : \r\n" + queryCollection, "ObjectUpdate", "breakJSONObject");
            }

            return result;
        }

        public static String autoNumberWithFormat(SqlConnection oCon, String nTable, String nField, String vFormat, int pLen)
        {
            String lastcounter = "";
            String temp = "";

            try
            {
                String sqlSelect = "SELECT ISNULL(CAST(MAX(SUBSTRING(" + nField + ",len('" + vFormat + "')+1, " + pLen + ")) AS INTEGER)+1,1) AS NUM "
                                   + "FROM " + nTable + " WITH (NOLOCK) WHERE SUBSTRING(" + nField + ", 1,len('" + vFormat + "')) ='" + vFormat + "'";

                using (SqlDataReader oResult = Database.doQuery(oCon, sqlSelect))
                {
                    if (oResult != null)
                    {
                        if (!oResult.HasRows)
                        {
                            lastcounter = "1";
                        }
                        else
                        {
                            while (oResult.Read())
                            {
                                lastcounter = oResult["NUM"].ToString();
                            }
                        }
                    }
                    else
                    {
                        lastcounter = "1";
                    }
                }

                for (int i = 1; i <= pLen - lastcounter.Length; i++)
                {
                    temp += "0";
                }
            }
            catch (Exception ex)
            {
                Utils.WriteLog("Error Message : \r\n" + ex.Message + "\r\nnTable Param : " + nTable + "\r\nnField Param : " + nField + "\r\npLen Param : " + pLen + "\r\nField Param : " + nField, "ObjectUpdate", "breakJSONObject");
            }

            return vFormat + temp + lastcounter;
        }

        public static String generateQuery(SqlConnection oCon, String childName, JObject dtFields, String tableName, String autonumFormat, String modifyStatus, int relCount, int isGetAutonumber, String prefixDb = "")
        {
            String dmlQuery = "NO SQL";
            String condition;
            String dataFlag;
            String data_flag;
            String data_key;
            String custom;
            String[] dataFlagArr;
            Boolean firstField;

            int fieldCounter;
            int valueCounter;

            try
            {
                switch (modifyStatus)
                {
                    case "INS":
                        dmlQuery = "INSERT INTO " + tableName + " (";
                        firstField = true;
                        fieldCounter = 1;

                        for (int i = 0; i < dtFields[childName].Count(); i++)
                        {
                            if (dtFields[childName][i]["fieldType"].ToString() == "vlt")
                            {
                            }
                            else
                            {
                                if (dtFields[childName][i]["fieldType"].ToString() != "autonumber" && dtFields[childName][i]["fieldType"].ToString() != "refid")
                                {
                                    if (!firstField) dmlQuery += ",";
                                    firstField = false;
                                    dmlQuery += dtFields[childName][i]["fieldName"].ToString();
                                    fieldCounter++;
                                }
                            }
                        }

                        dmlQuery += ", CREATED_AT) VALUES (";
                        firstField = true;
                        valueCounter = 1;

                        for (int i = 0; i < dtFields[childName].Count(); i++)
                        {
                            if (dtFields[childName][i]["fieldType"].ToString() == "vlt")
                            {
                            }
                            else
                            {
                                if (dtFields[childName][i]["fieldType"].ToString() != "autonumber" && dtFields[childName][i]["fieldType"].ToString() != "refid")
                                {
                                    if (!firstField) dmlQuery += ",";
                                    firstField = false;
                                    dataFlag = "";
                                    if (dtFields[childName][i]["flag"] != null) dataFlag = dtFields[childName][i]["flag"].ToString();
                                    data_flag = "";
                                    data_key = "";
                                    dataFlagArr = dataFlag.Split(':');

                                    if (dataFlagArr.Length > 0)
                                    {
                                        data_flag = dataFlagArr[0];
                                        if (dataFlagArr.Length > 1) data_key = dataFlagArr[1];
                                    }

                                    if (dataFlag.IndexOf(':') == -1) data_key = dataFlag;

                                    dmlQuery += dmlField(oCon, "INS", dtFields[childName][i]["fieldName"].ToString(), dtFields[childName][i]["fieldType"].ToString(), dtFields[childName][i]["fieldValue"].ToString(), data_key, tableName, autonumFormat, prefixDb);
                                }
                            }
                        }

                        dmlQuery += ", getdate());";
                        if (isGetAutonumber > 0) dmlQuery += " SELECT CAST(scope_identity() AS int);";
                        break;
                    case "UPD":
                        dmlQuery = "UPDATE " + tableName + " SET UPDATED_AT = getdate(), ";
                        firstField = true;
                        valueCounter = 1;

                        for (int i = 0; i < dtFields[childName].Count(); i++)
                        {
                            if (dtFields[childName][i]["fieldType"].ToString() == "vlt")
                            {
                            }
                            else
                            {
                                if (dtFields[childName][i]["fieldKey"].ToString() == "0")
                                {
                                    if (!firstField) dmlQuery += ",";
                                    firstField = false;
                                    valueCounter++;
                                    dataFlag = "";
                                    if (dtFields[childName][i]["flag"] != null) dataFlag = dtFields[childName][i]["flag"].ToString();
                                    data_flag = "";
                                    data_key = "";
                                    dataFlagArr = dataFlag.Split(':');

                                    if (dataFlagArr.Length > 0)
                                    {
                                        data_flag = dataFlagArr[0];
                                        if (dataFlagArr.Length > 1)
                                        {
                                            data_key = dataFlagArr[1];
                                            custom = dataFlagArr[2];
                                        }
                                    }

                                    if (dataFlag.IndexOf(':') == -1) data_key = dataFlag;

                                    dmlQuery += dmlField(oCon, "UPD", dtFields[childName][i]["fieldName"].ToString(), dtFields[childName][i]["fieldType"].ToString(), dtFields[childName][i]["fieldValue"].ToString(), data_key, tableName, autonumFormat, prefixDb);

                                }
                            }
                        }

                        condition = "";
                        firstField = true;

                        for (int i = 0; i < dtFields[childName].Count(); i++)
                        {
                            if (dtFields[childName][i]["fieldType"].ToString() == "vlt")
                            {
                            }
                            else
                            {
                                if (dtFields[childName][i]["fieldKey"].ToString() == "1")
                                {
                                    if (!firstField)
                                        condition += "  AND ";
                                    else
                                        condition += "  WHERE ";
                                    firstField = false;

                                    condition += dmlField(oCon, "CONDITION", dtFields[childName][i]["fieldName"].ToString().Replace("AUTONUMBER","ID"), dtFields[childName][i]["fieldType"].ToString(), dtFields[childName][i]["fieldValue"].ToString(), "", "", "", prefixDb);
                                }
                            }
                        }

                        if (condition != "")
                            dmlQuery += condition + ";";
                        else
                            dmlQuery = "";
                        break;
                    case "DEL":
                        dmlQuery = "DELETE FROM " + tableName + " ";
                        firstField = true;
                        condition = "";

                        for (int i = 0; i < dtFields[childName].Count(); i++)
                        {
                            if (dtFields[childName][i]["fieldType"].ToString() == "vlt")
                            {
                            }
                            else
                            {
                                if (dtFields[childName][i]["fieldKey"].ToString() == "1")
                                {
                                    if (!firstField)
                                        condition += "  AND ";
                                    else
                                        condition += "  WHERE ";
                                    firstField = false;

                                    condition += dmlField(oCon, "CONDITION", dtFields[childName][i]["fieldName"].ToString().Replace("AUTONUMBER","ID"), dtFields[childName][i]["fieldType"].ToString(), dtFields[childName][i]["fieldValue"].ToString(), "", "", "", prefixDb);
                                }
                            }
                        }

                        if (condition != "")
                            dmlQuery += condition + ";";
                        else
                            dmlQuery = "";
                        break;
                }
            }
            catch (Exception ex)
            {
                Utils.WriteLog("Error Message : \r\n" + ex.Message + "\r\nchildName Param : " + childName + "\r\ndtFields Param : \r\n" + dtFields.ToString() +
                               "\r\ntableNamen Param : " + tableName + "\r\nautonumFormat Param : " + autonumFormat + "\r\nmodifyStatus Param: " + modifyStatus +
                               "\r\nrelCount Param : " + relCount.ToString(), "ObjectUpdate", "generateQuery");
            }

            return dmlQuery;
        }

        public static String dmlField(SqlConnection oCon, String mode, String fieldName, String fieldType, String fieldValue, String dataKey, String tableName, String autoNumFormat, String prefixDb)
        {
            String dmlString = "";
            String strNumber = "";
            String autoNumber;

            try
            {
                switch (fieldType)
                {
                    case "string":
                        if (mode == "INS")
                        {
                            if (dataKey == "uppercase")
                            {
                                dmlString += "'" + fieldValue.ToString().ToUpper().Trim() + "'";
                            }
                            else
                            {
                                dmlString += "'" + fieldValue.Trim() + "'";
                            }
                        }
                        else if (mode == "UPD" || mode == "DEL" || mode == "CONDITION")
                        {
                            if (dataKey == "uppercase")
                            {
                                dmlString += fieldName + "='" + fieldValue.ToString().ToUpper().Trim() + "'";
                            }
                            else
                            {
                                dmlString += fieldName + "='" + fieldValue.Trim() + "'";
                            }
                        }
                        break;
                    case "textarea":
                        if (mode == "INS")
                        {
                            dmlString += "'" + fieldValue.Trim() + "'";
                        }
                        else
                        {
                            dmlString += fieldName + "='" + fieldValue.Trim() + "'";
                        }
                        break;
                  
                    case "numeric":
                        strNumber = "NULL";
                        if (!String.IsNullOrEmpty(fieldValue)) strNumber = fieldValue.Replace(",", "");
                        strNumber = Math.Floor(Double.Parse(strNumber)).ToString();
                        if (mode == "INS")
                            dmlString += strNumber;
                        else if (mode == "UPD" || mode == "DEL" || mode == "CONDITION")
                            dmlString += fieldName + "=" + strNumber;
                        break;
                    case "autonumber":
                        if (mode == "UPD" || mode == "CONDITION")
                            dmlString += fieldName + "=" + fieldValue.Replace(",", "").Replace(".", "");
                        break;
                    case "refid":
                        if (mode == "UPD" || mode == "CONDITION")
                            dmlString += "AUTONUMBER=" + fieldValue.Replace(",", "").Replace(".", "");
                        break;
                    case "decimal":
                        strNumber = "NULL";
                        if (!String.IsNullOrEmpty(fieldValue)) strNumber = fieldValue.Replace(",", ".");
                        if (mode == "INS")
                            dmlString += strNumber;
                        else if (mode == "UPD")
                            dmlString += fieldName + "=" + strNumber;
                        break;
                    case "decimal2":
                        strNumber = "NULL";
                        if (!String.IsNullOrEmpty(fieldValue)) strNumber = fieldValue.Replace(",", "");
                        if (mode == "INS")
                            dmlString += strNumber;
                        else if (mode == "UPD")
                            dmlString += fieldName + "=" + strNumber;
                        break;
                    case "date":
                        DateTime dateVal = DateTime.ParseExact(fieldValue, Utils.getParameter("datetime_format"), CultureInfo.InvariantCulture);
                        if (mode == "INS")
                            dmlString += "CONVERT(datetime, '" + dateVal.ToString("yyyy/MM/dd hh:mm:sstt") + "', 102)";
                        else if (mode == "UPD" || mode == "DEL" || mode == "CONDITION")
                            dmlString += fieldName + "= CONVERT(datetime, '" + dateVal.ToString("yyyy/MM/dd hh:mm:sstt") + "', 102)";
                        break;
                }
            }
            catch (Exception ex)
            {
                Utils.WriteLog("Error Message : \r\n" + ex.Message + "\r\nmode Param : " + mode + "\r\nfieldName Param : " + fieldName +
                               "\r\nfieldType Param : " + fieldType + "\r\nfieldValue Param : " + fieldValue + "\r\ndataKey Param: " + dataKey +
                               "\r\ntableName Param : " + tableName + "\r\nautoNumFormat Param : " + autoNumFormat, "ObjectUpdate", "dmlField");
            }

            return dmlString;
        }
    }
}
