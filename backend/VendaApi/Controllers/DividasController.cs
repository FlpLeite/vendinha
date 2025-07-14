using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using VendaApi.Models;
using VendaApi.Models.Dtos;
using VendaApi.Services;

namespace VendaApi.Controllers
{
    [ApiController]
    [Route("clientes/{clienteId}/[controller]")]
    public class DividasController : ControllerBase
    {
        private readonly IClientesService _clientesService;
        private readonly NHibernate.ISession _session;

        public DividasController(
            IClientesService clientesService,
            NHibernate.ISession session)
        {
            _clientesService = clientesService;
            _session = session;
        }

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
                    ClienteId = d.Cliente.Id,
                    ClienteNome = d.Cliente.NomeCompleto,
                    Id = d.Id,
                    CriadoPorId = d.CriadoPor.Id,
                    PagoPorId = d.PagoPor != null ? d.PagoPor.Id : (int?)null,
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
        public async Task<IActionResult> Create(int clienteId, [FromBody] DividasDTO dto)
        {
            try
            {
                var novaDivida = new Dividas
                {
                    Valor = dto.Valor,
                    Descricao = dto.Descricao
                };

                var criada = await _clientesService.CriarDividaAsync(clienteId, dto.CriadoPorId, novaDivida);

                var resultDto = new DividasDTO
                {
                    ClienteId = clienteId,
                    ClienteNome = criada.Cliente.NomeCompleto,
                    Id = criada.Id,
                    Valor = criada.Valor,
                    Situacao = criada.Situacao,
                    DataCriacao = criada.DataCriacao,
                    DataPagamento = criada.DataPagamento,
                    Descricao = criada.Descricao,
                    CriadoPorId = criada.CriadoPor.Id,
                    PagoPorId = criada.PagoPor?.Id
                };

                return CreatedAtAction(nameof(GetAll), new { clienteId }, resultDto);
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}/pagar")]
        public IActionResult MarcarComoPaga(int clienteId, int id, [FromQuery] int usuarioId)
        {
            var d = _session.Get<Dividas>(id);
            if (d == null || d.Cliente.Id != clienteId)
                return NotFound($"Dívida {id} não encontrada para cliente {clienteId}.");

            if (d.Situacao)
                return BadRequest("Dívida já está paga.");

            var usuario = _session.Get<Usuarios>(usuarioId);
            if (usuario == null)
                return NotFound($"Usuário {usuarioId} não encontrado.");

            d.Situacao = true;
            d.DataPagamento = DateTime.UtcNow;
            d.PagoPor = usuario;

            using var tx = _session.BeginTransaction();
            _session.Update(d);
            tx.Commit();

            var dto = new DividasDTO
            {
                ClienteId = d.Cliente.Id,
                ClienteNome = d.Cliente.NomeCompleto,
                Id = d.Id,
                CriadoPorId = d.CriadoPor.Id,
                PagoPorId = d.PagoPor?.Id,
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
