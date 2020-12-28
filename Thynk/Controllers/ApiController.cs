using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Cors;
using System.Web.Mvc;
using Thynk.Models;

namespace Thynk.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ApiController : Controller
    {
        private EmpDBContext db = new EmpDBContext();


        // GET: Api/List
        public ActionResult List()
        {
            try
            {
                var employees = db.Employees.ToArray();
                return Json(employees, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(
                    new
                    {
                        Success = false
                    }
               );
            }
        }

        // POST: Api/Create
        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                Employee employee = new Employee();

                employee.Id = Guid.NewGuid().ToString();
                employee.Name = collection.Get("Name");
                employee.Title = collection.Get("Title");
                employee.ProfileImage = collection.Get("ProfileImage");
                employee.Motto = collection.Get("Motto");
                employee.Hobbies = collection.Get("Hobbies");
                employee.Hometown = collection.Get("Hometown");
                employee.Blog = collection.Get("Blog");

                db.Employees.Add(employee);
                db.SaveChanges();

                return Json(
                    new
                    {
                        Success = true
                    }
               );
            }
            catch
            {
                return Json(
                    new
                    {
                        Success = false
                    }
               );
            }
        }


        // POST: Api/Edit/5
        [HttpPost]
        public ActionResult Edit(string id, FormCollection collection)
        {
            try
            {
                Employee employee = db.Employees.Where(emp => emp.Id == id).Single();

                employee.Name = collection.Get("Name");
                employee.Title = collection.Get("Title");
                employee.ProfileImage = collection.Get("ProfileImage");
                employee.Motto = collection.Get("Motto");
                employee.Hobbies = collection.Get("Hobbies");
                employee.Hometown = collection.Get("Hometown");
                employee.Blog = collection.Get("Blog");
                
                db.SaveChanges();


                return Json(
                    new
                    {
                        Success = true
                    }
               );
            }
            catch
            {
                return Json(
                    new
                    {
                        Success = false
                    }
               );
            }
        }

        // POST: Api/Delete/5
        [HttpGet]
        public JsonResult Delete(string id)
        {
            try
            {
                Employee employee = db.Employees.Where(emp => emp.Id == id).Single();

                db.Employees.Remove(employee);

                db.SaveChanges();

                return Json(
                    new
                    {
                        Success = true
                    },
                    JsonRequestBehavior.AllowGet
               );
            }
            catch
            {
                return Json(
                    new
                    {
                        Success = false
                    }
               );
            }
        }
    }
}
