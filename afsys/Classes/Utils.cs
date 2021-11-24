using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Xml;
using System.Security.Cryptography;
using System.Configuration;

namespace afsys.Classes
{
    public static class Utils
    {
        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private static string[] _arrayOfOnes = { string.Empty, "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTTEEN", "NINETEEN" };
        private static string[] _arrayOfTens = { string.Empty, "TEN", "TWENTY", "THIRTY", "FORTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY" };

        public static String getDefaultSystemPath()
        {
            return System.IO.Path.GetDirectoryName(System.Reflection.Assembly.GetEntryAssembly().Location);
        }

        public static Boolean isValidSpecialCharacter(String strValue)
        {
            Boolean isValid = true;

            if (!String.IsNullOrEmpty(strValue))
            {
                if (strValue.IndexOf("\"") != -1 || strValue.IndexOf("\\") != -1 || strValue.IndexOf("'") != -1 || strValue.IndexOf("&") != -1)
                {
                    isValid = false;
                }
            }

            return isValid;
        }

        public static String getDBConnectionString()
        {
            String conStr = "";

            try
            {
                if (!String.IsNullOrEmpty(Utils.getParameter("dbhost")) && !String.IsNullOrEmpty(Utils.getParameter("dbname")) && !String.IsNullOrEmpty(Utils.getParameter("dbuser")) && !String.IsNullOrEmpty(Utils.getParameter("dbpass")))
                {
                    conStr = "Data Source=" + Utils.getParameter("dbhost") + ";Initial Catalog=" + Utils.getParameter("dbname") + ";User ID=" + Utils.getParameter("dbuser") + ";Password=" + Utils.getParameter("dbpass") + ";MultipleActiveResultSets=True;";
                    conStr += "Pooling=false;";
                    
                }
            }
            catch (Exception ex)
            {
                Utils.WriteLog("Error Message : \r\n" + ex.Message, "Utils", "getDBConnectionString");
            }

            return conStr;
        }

        public static String getQuery(String fileName = "", String queryTag = "")
        {
            String queryStr = "";
            String strFileName = fileName;

            if (!String.IsNullOrEmpty(fileName) && !String.IsNullOrEmpty(queryTag))
            {
                if (fileName.ToLower().IndexOf(".xml") == -1) strFileName += ".xml";
                if (File.Exists(Utils.getParameter("xmlDir") + strFileName))
                {
                    try
                    {
                        using (XmlTextReader xmlreader = new XmlTextReader(Utils.getParameter("xmlDir") + strFileName))
                        {
                            xmlreader.WhitespaceHandling = WhitespaceHandling.None;
                            XmlDocument xmlQuery = new XmlDocument();
                            xmlQuery.Load(xmlreader);
                            if (!String.IsNullOrEmpty(xmlQuery.GetElementsByTagName(queryTag).Item(0).InnerText.ToString()))
                            {
                                queryStr = xmlQuery.GetElementsByTagName(queryTag).Item(0).InnerText.ToString();
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        Utils.WriteLog("Error Message : \r\n" + ex.Message + "\r\nfileName Param : " + fileName + "\r\nqueryTag Param : " + queryTag, "Utils", "getDBConnectionString");
                    }
                }
            }
            return queryStr;
        }
        
        public static String getParameter(String paramId)
        {
            String result = "";

            if (!String.IsNullOrEmpty(paramId))
            {
                result = System.Configuration.ConfigurationManager.AppSettings[paramId];
            }

            return result;
        }

        public static string convertParam(string strUrl)
        {
            return strUrl.Replace("`", "/");
        }

        public static string converToJSon(string strValue)
        {
            return strValue.Replace("\"", "~");
        }
        
        public static void WriteLog(String logMessage, String className = "", String funcName = "", String logType = "error")
        {
            DateTime now = DateTime.Now;
            String userFullName = "";
            String log = "";

            log = "\r\n" + "User : " + userFullName + "\r\n";
            if (!String.IsNullOrEmpty(className)) log += "Class Name : " + className + "\r\n";
            if (!String.IsNullOrEmpty(funcName)) log += "Function Name : " + funcName + "\r\n";
            log += logMessage + "\r\n"
                   + "-------------------------------" + "\r\n";

            switch (logType.ToLower())
            {
                case "fatal":
                    logger.Fatal(log);
                    break;
                case "error":
                    logger.Error(log);
                    break;
                case "warn":
                    logger.Warn(log);
                    break;
                case "info":
                    logger.Info(log);
                    break;
                case "debug":
                    logger.Debug(log);
                    break;
            }
        }
    }
}