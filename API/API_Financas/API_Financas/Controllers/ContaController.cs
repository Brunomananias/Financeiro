using Microsoft.AspNetCore.Mvc;
using API_Financas.Data;
using API_Financas.Models;
using Microsoft.EntityFrameworkCore;
using API_Financas.Repositories;
using API_Financas.Repositories.Interfaces;

namespace FinanceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContaController : ControllerBase
    {
        private readonly IContaRepository _contaRepository;

        public ContaController(IContaRepository contaRepository)
        {
            _contaRepository = contaRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var contas = await _contaRepository.BuscarTodasContas();
            return Ok(contas);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var conta = await _contaRepository.BuscarContasID(id);
            if (conta == null)
                return NotFound();

            return Ok(conta);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Conta conta)
        {
            if (conta == null)
                return BadRequest("Conta não pode ser nula.");

            await _contaRepository.AdicionarConta(conta);
            return CreatedAtAction(nameof(GetById), new { id = conta.Id }, conta);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Conta conta)
        {
            if (id != conta.Id)
                return BadRequest("ID da conta não corresponde.");

            await _contaRepository.AtualizarConta(conta);
            return Ok(conta);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var conta = await _contaRepository.BuscarContasID(id);
            if (conta == null)
                return NotFound(new { mensagem = "Conta não encontrada." });

            await _contaRepository.DeletarConta(id);
            return Ok(new { mensagem = "Conta deletada com sucesso." });
        }
    }
}
