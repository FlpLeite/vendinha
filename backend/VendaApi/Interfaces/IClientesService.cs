using System.Threading.Tasks;
using VendaApi.Models;

namespace VendaApi.Services
{
    public interface IClientesService
    {
        Task<Dividas> CriarDividaAsync(int clienteId, Dividas novaDivida);
    }
}
