using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(afsys.Startup))]
[assembly: log4net.Config.XmlConfigurator(ConfigFile = "Web.config", Watch = true)]
namespace afsys
{
    public partial class Startup
    {
        /*
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            //ConfigureAuth(app);
        }
        */

        public void Configuration(IAppBuilder app)
        {
            app.UseCookieAuthentication(
                new Microsoft.Owin.Security.Cookies.CookieAuthenticationOptions
                {

                // YOUR LOGIN PATH
                LoginPath = new PathString("/Login")
                }
            );
        }
        
    }


}
