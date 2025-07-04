using Microsoft.AspNetCore.Mvc;
using NHibernate;
using VendaApi.Models;
using VendaApi.Models.Dtos;
using System.Linq;

namespace VendaApi.Controllers
{
    [ApiController]
    [Route("clientes/{clienteId}/[controller]")]
    public class DividasController : ControllerBase
    {
        private readonly NHibernate.ISession _session;
        public DividasController(NHibernate.ISession session) => _session = session;

        [HttpGet]
        public IActionResult GetAll(int clienteId)
        {
            var cliente = _session.Get<Clientes>(clienteId);
            if (cliente == null)
                return NotFound($"Cliente {clienteId} não encontrado.");

            var dtos = _session.Query<Dividas>()
                .Where(d => d.Cliente.Id == clienteId)
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

            var totalAbertas = dtos.Where(d => !d.Situacao).Sum(d => d.Valor);

            return Ok(new
            {
                Dividas = dtos,
                TotalEmAberto = totalAbertas
            });
        }

        [HttpPost]
        public IActionResult Create(int clienteId, [FromBody] DividasDTO dto)
        {
            var cliente = _session.Get<Clientes>(clienteId);
            if (cliente == null)
                return NotFound($"Cliente {clienteId} não encontrado.");

            var somaEmAberto = _session.Query<Dividas>()
                .Where(d => d.Cliente.Id == clienteId && !d.Situacao)
                .Sum(d => d.Valor);

            if (somaEmAberto + dto.Valor > 200m)
                return BadRequest($"Limite de R$200,00 ultrapassado. Em aberto: {somaEmAberto:C2}.");

            var d = new Dividas
            {
                Cliente = cliente,
                Valor = dto.Valor,
                Situacao = false,
                DataCriacao = DateTime.UtcNow,
                DataPagamento = null,
                Descricao = dto.Descricao
            };
            using var tx = _session.BeginTransaction();
            _session.Save(d);
            tx.Commit();

            dto.Id = d.Id;
            dto.Situacao = d.Situacao;
            dto.DataCriacao = d.DataCriacao;
            dto.DataPagamento = d.DataPagamento;

            return CreatedAtAction(nameof(GetAll), new { clienteId }, dto);
        }
        
        [HttpPut("{id}/pagar")]
        public IActionResult MarcarComoPaga(int clienteId, int id)
        {
            var d = _session.Get<Dividas>(id);
            if (d == null || d.Cliente.Id != clienteId)
                return NotFound($"Dívida {id} não encontrada para cliente {clienteId}.");

            if (d.Situacao)
                return BadRequest("Dívida já está paga.");

            d.Situacao = true;
            d.DataPagamento = DateTime.UtcNow;
            using var tx = _session.BeginTransaction();
            _session.Update(d);
            tx.Commit();

            var dto = new DividasDTO
            {
                Id = d.Id,
                Valor = d.Valor,
                Situacao = d.Situacao,
                DataCriacao = d.DataCriacao,
                DataPagamento = d.DataPagamento,
                Descricao = d.Descricao
            };
            return Ok(dto);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int clienteId, int id)
        {
            var d = _session.Get<Dividas>(id);
            if (d == null || d.Cliente.Id != clienteId)
                return NotFound($"Dívida {id} não encontrada para cliente {clienteId}.");

            using var tx = _session.BeginTransaction();
            _session.Delete(d);
            tx.Commit();

            return NoContent();
        }
    }
}
