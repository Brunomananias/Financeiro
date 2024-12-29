using API_Financas.Data;
using API_Financas.Models;
using Microsoft.AspNetCore.Mvc;

namespace API_Financas.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PagamentosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PagamentosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_context.Forma_Pagamento.ToList());
        }

        [HttpPost]
        public IActionResult Create(Pagamento pagamento)
        {
            _context.Forma_Pagamento.Add(pagamento);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetAll), new { id = pagamento.Id }, pagamento);
        }
    }
}
