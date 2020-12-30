using Microsoft.AspNetCore.Mvc;
using Realty.Web.Controllers;

namespace Realty.Web.Public.Controllers
{
    public class AboutController : RealtyControllerBase
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}