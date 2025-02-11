using API_Financas.Data;
using API_Financas.Models;
using API_Financas.Repositories.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static System.Net.Mime.MediaTypeNames;

namespace API_Financas.Repositories
{
    public class ContaRepository :  IContaRepository
    {
        private readonly AppDbContext _context;

        public ContaRepository(AppDbContext context) 
        { 
            _context = context;
        }        

        public async Task<IEnumerable<Conta>> BuscarTodasContas()
        {
            return await _context.Contas.ToListAsync();
        }

        public async Task<Conta> BuscarContasID(int id)
        {
            return await _context.Contas.FindAsync(id);
        }

        public async Task AdicionarConta(Conta conta)
        {          
            _context.Contas.Add(conta);
            await _context.SaveChangesAsync();
        }

        public async Task AtualizarConta(Conta conta)
        {
            var existingConta = await _context.Contas.FindAsync(conta.Id);
            if (existingConta == null) return;

            existingConta.DataLancamento = conta.DataLancamento ?? DateTime.Now;
            existingConta.Forma_pagamento_id = conta.Forma_pagamento_id;
            existingConta.Tipo = "saída";
            existingConta.Descricao = conta.Descricao;
            existingConta.Valor = conta.Valor;
            existingConta.CategoriaId = conta.CategoriaId;
            existingConta.Vencimento = conta.Vencimento;

            await _context.SaveChangesAsync();
        }

        public async Task DeletarConta(int id)
        {
            var conta = await _context.Contas.FindAsync(id);
            if (conta != null)
            {
                _context.Contas.Remove(conta);
                await _context.SaveChangesAsync();
            }
        }
    }
}
