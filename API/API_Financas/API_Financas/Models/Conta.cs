namespace API_Financas.Models
{
    public class Conta
    {
        public int Id { get; set; }
        public string Descricao { get; set; }
        public decimal Valor { get; set; }
        public string? Tipo { get; set; }
        public DateTime? DataLancamento { get; set; }
        public int? CategoriaId { get; set; }
        public int? Forma_pagamento_id { get; set; }
        public DateTime? Vencimento { get; set; }
        public bool? Vencida { get; set; }
    }
}
