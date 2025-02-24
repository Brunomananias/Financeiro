using FluentValidation;

namespace API_Financas.Models.Validators
{
    public class ContaValidator : AbstractValidator<Conta>
    {
        public ContaValidator()
        {
            RuleFor(c => c.Descricao)
                .NotEmpty().WithMessage("A descrição é obrigatória.")
                .Length(2, 200).WithMessage("A descrição deve ter entre 2 a 200 caracteres.");

            RuleFor(c => c.Valor)
                .GreaterThan(0).WithMessage("O valor deve ser maior que zero.");
        }
    }
}
