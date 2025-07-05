using System;
using System.Linq;
using System.Threading.Tasks;
using NHibernate;
using VendaApi.Models;
using VendaApi.Services;

namespace VendaApi.Services
{
    public class ClientesService : IClientesService
    {
        private readonly ISession _session;

        public ClientesService(ISession session)
        {
            _session = session;
        }

        public async Task<Dividas> CriarDividaAsync(int clienteId, Dividas novaDivida)
        {
            var cliente = await _session.GetAsync<Clientes>(clienteId);
            if (cliente == null)
                throw new ArgumentException($"Cliente {clienteId} não encontrado.");

            var somaEmAberto = _session.Query<Dividas>()
                .Where(d => d.Cliente.Id == clienteId && !d.Situacao)
                .Sum(d => (decimal?)d.Valor)
                ?? 0m;

            if (somaEmAberto + novaDivida.Valor > 200m)
                throw new InvalidOperationException(
                    $"Limite de R$200,00 ultrapassado. Em aberto: {somaEmAberto:C2}"
                );

            novaDivida.Cliente = cliente;
            novaDivida.DataCriacao = DateTime.UtcNow;
            novaDivida.Situacao = false;
            novaDivida.DataPagamento = null;

            using var tx = _session.BeginTransaction();
            await _session.SaveAsync(novaDivida);
            await tx.CommitAsync();

            return novaDivida;
        }
    }
}
