using API_Financas.Models;

namespace API_Financas.Repositories.Interfaces
{
    public interface IContaRepository
    {
            Task<IEnumerable<Conta>> BuscarTodasContas();
            Task<Conta> BuscarContasID(int id);
            Task AdicionarConta(Conta conta);
            Task AtualizarConta(Conta conta);
            Task DeletarConta(int id);

    }
}
