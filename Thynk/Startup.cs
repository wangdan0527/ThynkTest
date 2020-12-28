using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Thynk.Startup))]
namespace Thynk
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
