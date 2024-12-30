using Microsoft.AspNetCore.Mvc;
using API_Financas.Data;
using API_Financas.Models;
using Microsoft.EntityFrameworkCore;

namespace FinanceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContaController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ContaController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_context.Contas.ToList());
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Conta conta)
        {
            if (conta == null)
            {
                return BadRequest("Conta não pode ser nula.");
            }

            // Adiciona a conta ao contexto
            _context.Contas.Add(conta);
            await _context.SaveChangesAsync();

            // Retorna o recurso criado
            return CreatedAtAction(nameof(Create), new { id = conta.Id }, conta);
        }

        [HttpPut("{id}")]
        public IActionResult AtualizarConta(int id, [FromBody] Conta contaAtualizada)
        {
            var conta = _context.Contas.Find(id);
            if (conta == null)
            {
                return NotFound();
            }

            conta.DataLancamento = contaAtualizada.DataLancamento ?? DateTime.Now;
            conta.Forma_pagamento_id = contaAtualizada.Forma_pagamento_id;
            conta.Tipo = "saída";
            _context.SaveChanges();

            return Ok(conta);
        }

        [HttpDelete("{id}")]
        public IActionResult DeletarConta(int id)
        {
            var conta = _context.Contas.FirstOrDefault(c => c.Id == id);
            if(conta == null)
            {
                return NotFound(new { mensagem = "Conta não encontrada." });
            }

            _context.Contas.Remove(conta);
            _context.SaveChanges();

            return Ok(new { mensagem = "Conta deletada com sucesso." });
        }

    }
}
