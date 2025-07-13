using System.Linq;
using Microsoft.AspNetCore.Mvc;
using VendaApi.Models;
using VendaApi.Models.Dtos;

namespace VendaApi.Controllers
{
    [ApiController]
    [Route("api/dividas")]
    public class DividasListController : ControllerBase
    {
        private readonly NHibernate.ISession _session;

        public DividasListController(NHibernate.ISession session)
        {
            _session = session;
        }

        [HttpGet]
        public IActionResult Get([FromQuery] int page = 1)
        {
            const int pageSize = 10;

            var query = _session.Query<Dividas>();

            var items = query
                .OrderByDescending(d => d.DataCriacao)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(d => new DividasDTO
                {
                    ClienteId = d.Cliente.Id,
                    ClienteNome = d.Cliente.NomeCompleto,
                    Id = d.Id,
                    Valor = d.Valor,
                    Situacao = d.Situacao,
                    DataCriacao = d.DataCriacao,
                    DataPagamento = d.DataPagamento,
                    Descricao = d.Descricao
                })
                .ToList();

            return Ok(new { Page = page, PageSize = pageSize, Items = items });
        }
    }
}