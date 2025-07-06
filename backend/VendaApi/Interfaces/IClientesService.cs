using System.Threading.Tasks;
using VendaApi.Models;

namespace VendaApi.Services
{
    public interface IClientesService
    {
        /// <summary>
        /// Cria uma nova dívida para o cliente, validando o limite de R$200.
        /// </summary>
        /// <param name="clienteId">ID do cliente</param>
        /// <param name="novaDivida">Objeto Dividas já preenchido com Valor e Descricao</param>
        /// <returns>A dívida criada (com ID, DataCriacao, etc.)</returns>
        Task<Dividas> CriarDividaAsync(int clienteId, Dividas novaDivida);
    }
}
