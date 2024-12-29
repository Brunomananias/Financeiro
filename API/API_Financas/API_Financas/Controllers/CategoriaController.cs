using Microsoft.AspNetCore.Mvc;
using API_Financas.Data;
using API_Financas.Models;

namespace FinanceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriaController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriaController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_context.Categorias.ToList());
        }

        [HttpPost]
        public IActionResult Create(Categoria categoria)
        {
            _context.Categorias.Add(categoria);
               _context.SaveChanges();
            return CreatedAtAction(nameof(GetAll), new { id = categoria.Id }, categoria);
        }
    }
}
