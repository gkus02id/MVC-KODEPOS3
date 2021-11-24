using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace afsys
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "login",
                url: "login",
                defaults: new { controller = "Account", action = "Login" }
            );


            routes.MapRoute(
                name: "logout",
                url: "logout",
                defaults: new { controller = "Account", action = "Logout" }
            );

            routes.MapRoute(
                name: "log-action",
                url: "log-action",
                defaults: new { controller = "Account", action = "Validate" }
            );
            
            routes.MapRoute(
                name: "popuppropinsi",
                url: "popuppropinsi",
                defaults: new { controller = "Propinsi", action = "PopUpForm" }
            );

            routes.MapRoute(
                name: "listpropinsi",
                url: "listpropinsi",
                defaults: new { controller = "Propinsi", action = "Read" }
            );

            routes.MapRoute(
                name: "readpropinsi",
                url: "readpropinsi",
                defaults: new { controller = "Propinsi", action = "ReadList" }
            );

            routes.MapRoute(
                name: "editpropinsi",
                url: "editpropinsi_{id}",
                defaults: new { controller = "Propinsi", action = "PopUpForm", id = UrlParameter.Optional }
            );

            routes.MapRoute(
               name: "deletepropinsi",
               url: "deletepropinsi_{id}",
               defaults: new { controller = "Propinsi", action = "Delete", id = UrlParameter.Optional }
           );

            routes.MapRoute(
                name: "popupkabupaten",
                url: "popupkabupaten",
                defaults: new { controller = "Kabupaten", action = "PopUpForm" }
            );

            routes.MapRoute(
                name: "listkabupaten",
                url: "listkabupaten",
                defaults: new { controller = "Kabupaten", action = "Read" }
            );

            routes.MapRoute(
                name: "readkabupaten",
                url: "readkabupaten",
                defaults: new { controller = "Kabupaten", action = "ReadList" }
            );

            routes.MapRoute(
                name: "editkabupaten",
                url: "editkabupaten_{id}",
                defaults: new { controller = "Kabupaten", action = "PopUpForm", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "deletekabupaten",
                url: "deletekabupaten_{id}",
                defaults: new { controller = "Kabupaten", action = "Delete", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "popupkecamatan",
                url: "popupkecamatan",
                defaults: new { controller = "Kecamatan", action = "PopUpForm" }
            );

            routes.MapRoute(
                name: "listkecamatan",
                url: "listkecamatan",
                defaults: new { controller = "Kecamatan", action = "Read" }
            );

            routes.MapRoute(
               name: "readkecamatan",
               url: "readkecamatan",
               defaults: new { controller = "Kecamatan", action = "ReadList" }
           );

            routes.MapRoute(
                name: "editkecamatan",
                url: "editkecamatan_{id}",
                defaults: new { controller = "Kecamatan", action = "PopUpForm", id = UrlParameter.Optional }
            );

            routes.MapRoute(
               name: "deletekecamatan",
               url: "deletekecamatan_{id}",
               defaults: new { controller = "Kecamatan", action = "Delete", id = UrlParameter.Optional }
           );

            routes.MapRoute(
                name: "uniquepropinsi01",
                url: "uniquepropinsi01_{id}_{keyword}",
                defaults: new { controller = "Propinsi", action = "Unique01", id = UrlParameter.Optional, keyword = UrlParameter.Optional }
            );
            
            routes.MapRoute(
                            name: "kodepos",
                            url: "kodepos",
                            defaults: new { controller = "Kodepos", action = "Index" }
                       );

            routes.MapRoute(
                            name: "popupkodepos",
                            url: "popupkodepos",
                            defaults: new { controller = "Kodepos", action = "PopUpForm" }
                       );

            routes.MapRoute(
                            name: "editkodepos",
                            url: "editkodepos_{id}",
                            defaults: new { controller = "Kodepos", action = "PopUpForm", id = UrlParameter.Optional }
                        );

            routes.MapRoute(
                            name: "deletekodepos",
                            url: "deletekodepos_{id}",
                            defaults: new { controller = "Router", action = "Delete", tid = "MS_KODEPOS", id = UrlParameter.Optional }
                        );
            
            routes.MapRoute(
                name: "readkodepos",
                url: "readkodepos",
                defaults: new { controller = "Kodepos", action = "Read" }
            );

            routes.MapRoute(
                            name: "getoptionkabupaten",
                            url: "getoptionkabupaten",
                            defaults: new { controller = "Kodepos", action = "GetOptionKabupaten" }
                        );

            routes.MapRoute(
                            name: "getoptionkecamatan",
                            url: "getoptionkecamatan",
                            defaults: new { controller = "Kodepos", action = "GetOptionKecamatan" }
                        );

            routes.MapRoute(
                name: "save-data",
                url: "save-data",
                defaults: new { controller = "Router", action = "Save" }
            );

            routes.MapRoute(
               name: "delete",
               url: "delete_{tid}_{id}",
               defaults: new { controller = "Router", action = "Delete", tid = UrlParameter.Optional, id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "popup0105",
                url: "popup0105",
                defaults: new { controller = "Itemcaf17", action = "PopupForm" }
            );

            routes.MapRoute(
                name: "edit0105",
                url: "edit0105_{id}",
                defaults: new { controller = "Itemcaf17", action = "PopUpForm", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "reset0105",
                url: "reset0105",
                defaults: new { controller = "Itemcaf17", action = "Reset" }
            );

            routes.MapRoute(
                name: "read0105",
                url: "read0105",
                defaults: new { controller = "Itemcaf17", action = "Read" }
            );

            routes.MapRoute(
                name: "unique010501",
                url: "unique010501_{id}_{keyword}",
                defaults: new { controller = "Itemcaf17", action = "Unique01", id = UrlParameter.Optional, keyword = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "unique010502",
                url: "unique010502_{id}_{keyword}",
                defaults: new { controller = "Itemcaf17", action = "Unique02", id = UrlParameter.Optional, keyword = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "unique010503",
                url: "unique010503_{id}_{keyword}",
                defaults: new { controller = "Itemcaf17", action = "Unique03", id = UrlParameter.Optional, keyword = UrlParameter.Optional }
            );

            routes.MapRoute(
               name: "Default",
               url: "{controller}/{action}/{id}",
               defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );

        }
    }
}
