using Microsoft.AspNetCore.Mvc;
using VendaApi.Models;
using VendaApi.Models.Dtos;
using System.Linq;
using VendaApi.Controllers;

namespace VendaApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ClientesController : ControllerBase
    {
        private readonly NHibernate.ISession _session;

        public ClientesController(NHibernate.ISession session) => _session = session;

        [HttpGet]
        public IActionResult GetAll()
        {
            var dtos = _session.Query<Clientes>()
                .Select(c => new ClientesDto
                {
                    Id = c.Id,
                    NomeCompleto = c.NomeCompleto,
                    Cpf = c.Cpf,
                    DataNascimento = c.DataNascimento,
                    Email = c.Email
                })
                .ToList();
            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var c = _session.Get<Clientes>(id);
            if (c == null) return NotFound();

            var dto = new ClientesDto
            {
                Id = c.Id,
                NomeCompleto = c.NomeCompleto,
                Cpf = c.Cpf,
                DataNascimento = c.DataNascimento,
                Email = c.Email
            };
            return Ok(dto);
        }

        [HttpPost]
        public IActionResult Create([FromBody] ClientesDto dto)
        {
            var c = new Clientes
            {
                NomeCompleto = dto.NomeCompleto,
                Cpf = dto.Cpf,
                DataNascimento = dto.DataNascimento,
                Email = dto.Email
            };

            using var tx = _session.BeginTransaction();
            _session.Save(c);
            tx.Commit();

            dto.Id = c.Id;
            return CreatedAtAction(nameof(GetById), new { id = dto.Id }, dto);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] ClientesDto dto)
        {
            var c = _session.Get<Clientes>(id);
            if (c == null) return NotFound();

            c.NomeCompleto = dto.NomeCompleto;
            c.Cpf = dto.Cpf;
            c.DataNascimento = dto.DataNascimento;
            c.Email = dto.Email;

            using var tx = _session.BeginTransaction();
            _session.Update(c);
            tx.Commit();

            dto.Id = c.Id;
            return Ok(dto);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var c = _session.Get<Clientes>(id);
            if (c == null) return NotFound();

            using var tx = _session.BeginTransaction();
            _session.Delete(c);
            tx.Commit();

            return NoContent();
        }
    }
}
