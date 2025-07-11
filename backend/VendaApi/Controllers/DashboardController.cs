using System.Linq;
using Microsoft.AspNetCore.Mvc;
using VendaApi.Models;

namespace VendaApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly NHibernate.ISession _session;

        public DashboardController(NHibernate.ISession session)
        {
            _session = session;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var totalClientes = _session.Query<Clientes>().Count();

            var dividasQuery = _session.Query<Dividas>();
            var totalDividas = dividasQuery.Count(d => !d.Situacao);
            var valorTotalPendente = dividasQuery
                .Where(d => !d.Situacao)
                .Sum(d => (decimal?)d.Valor) ?? 0m;
            var valorTotalPago = dividasQuery
                .Where(d => d.Situacao)
                .Sum(d => (decimal?)d.Valor) ?? 0m;

            return Ok(new
            {
                TotalClientes = totalClientes,
                TotalDividas = totalDividas,
                ValorTotalPendente = valorTotalPendente,
                ValorTotalPago = valorTotalPago
            });
        }
    }
}