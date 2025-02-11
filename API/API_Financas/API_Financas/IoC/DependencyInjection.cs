using API_Financas.Repositories.Interfaces;
using API_Financas.Repositories;
using System.Net.NetworkInformation;
using Microsoft.Extensions.DependencyInjection;

namespace API_Financas.IoC
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddRepositories(this IServiceCollection services)
        {
            services.AddScoped<IContaRepository, ContaRepository>();
            return services;
        }
    }
}
