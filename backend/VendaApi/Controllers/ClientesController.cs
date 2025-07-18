using Microsoft.AspNetCore.Mvc;
using VendaApi.Models;
using VendaApi.Models.Dtos;
using CpfCnpjLibrary;

namespace VendaApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientesController : ControllerBase
    {
        private readonly NHibernate.ISession _session;

        public ClientesController(NHibernate.ISession session) => _session = session;

        private static bool IdadeValida(DateTime dataNascimento)
        {
            var hoje = DateTime.Today;
            var idade = hoje.Year - dataNascimento.Year;
            if (dataNascimento > hoje.AddYears(-idade)) idade--;
            return idade >= 10 && idade <= 100;
        }

        [HttpGet]
        public IActionResult GetAll(
        [FromQuery] int page = 1,
        [FromQuery] string? name = null)
        {
            const int pageSize = 10;

            var query = _session.Query<Clientes>();
            if (!string.IsNullOrWhiteSpace(name))
                query = query.Where(c =>
                    c.NomeCompleto.ToLower()
                     .Contains(name.ToLower()));

            var projected = query
              .Select(c => new ClientesListDto
              {
                  Id = c.Id,
                  NomeCompleto = c.NomeCompleto,
                  Cpf = c.Cpf,
                  DataNascimento = c.DataNascimento,
                  Email = c.Email,
                  Age = (int)(
                                      DateTime.Today
                                        .Subtract(c.DataNascimento)
                                        .TotalDays
                                      / 365.2425
                                   ),
                  TotalDebt = _session.Query<Dividas>()
                                     .Where(d => d.Cliente.Id == c.Id && !d.Situacao)
                                     .Sum(d => (decimal?)d.Valor)
                                   ?? 0m
              });

            var items = projected
              .OrderByDescending(x => x.TotalDebt)
              .Skip((page - 1) * pageSize)
              .Take(pageSize)
              .ToList();

            var totalDebtSum = _session.Query<Dividas>()
              .Where(d => !d.Situacao)
              .Sum(d => (decimal?)d.Valor)
            ?? 0m;

            return Ok(new
            {
                Page = page,
                PageSize = pageSize,
                Items = items,
                TotalDebtSum = totalDebtSum
            });
        }


        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var c = _session.Get<Clientes>(id);
            if (c == null) return NotFound();

            var dto = new ClientesDTO
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
        public IActionResult Create([FromBody] ClientesDTO dto)
        {
            if (!Cpf.Validar(dto.Cpf))
                return BadRequest(new { error = "CPF inválido de acordo com os padrões." });

            if (!IdadeValida(dto.DataNascimento))
                return BadRequest(new { error = "Cliente deve ter entre 10 e 100 anos." });

            if (_session.Query<Clientes>().Any(c => c.Cpf == dto.Cpf))
                return BadRequest(new { error = "Este CPF já pertence a um cliente." });

            var c = new Clientes
            {
                NomeCompleto = dto.NomeCompleto,
                Cpf = dto.Cpf,
                DataNascimento = dto.DataNascimento,
                Email = string.IsNullOrEmpty(dto.Email) ? null : dto.Email
            };

            using var tx = _session.BeginTransaction();
            _session.Save(c);
            tx.Commit();

            dto.Id = c.Id;
            return CreatedAtAction(nameof(GetById), new { id = dto.Id }, dto);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] ClientesDTO dto)
        {
            var c = _session.Get<Clientes>(id);
            if (c == null) return NotFound();
            if (!Cpf.Validar(dto.Cpf))
                return BadRequest(new { error = "CPF inválido de acordo com os padrões." });

            if (!IdadeValida(dto.DataNascimento))
                return BadRequest(new { error = "Cliente deve ter entre 10 e 100 anos." });

            if (_session.Query<Clientes>().Any(cl => cl.Cpf == dto.Cpf && cl.Id != id))
                return BadRequest(new { error = "Este CPF já pertence a um cliente." });

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
