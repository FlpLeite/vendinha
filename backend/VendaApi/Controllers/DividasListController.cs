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
        public IActionResult Get()
        {
            var dtos = _session.Query<Dividas>()
                .Select(d => new DividasDTO
                {
                    Id = d.Id,
                    Valor = d.Valor,
                    Situacao = d.Situacao,
                    DataCriacao = d.DataCriacao,
                    DataPagamento = d.DataPagamento,
                    Descricao = d.Descricao
                })
                .ToList();

            return Ok(dtos);
        }
    }
}