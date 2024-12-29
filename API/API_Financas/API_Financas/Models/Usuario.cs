namespace API_Financas.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Senha { get; set; }

        public ICollection<Conta> Contas { get; set; } // Relacionamento com Conta

    }
}
