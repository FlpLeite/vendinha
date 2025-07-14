using Microsoft.AspNetCore.Mvc;
using VendaApi.Models;
using VendaApi.Models.Dtos;
using System.Linq;
using BCrypt.Net;

namespace VendaApi.Controllers
{
    [ApiController]
    [Route("api/usuarios")]
    public class UsuariosController : ControllerBase
    {
        private readonly NHibernate.ISession _session;
        public UsuariosController(NHibernate.ISession session) => _session = session;

        [HttpPost("register")]
        public IActionResult Register([FromBody] UsuarioCadastroDTO dto)
        {
            var exists = _session.Query<Usuarios>().FirstOrDefault(u => u.Email.ToLower() == dto.Email.ToLower());
            if (exists != null)
                return Conflict(new { error = "Email já cadastrado" });

            var user = new Usuarios
            {
                Nome = dto.Nome,
                Email = dto.Email,
                Telefone = dto.Telefone,
                SenhaHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            using var tx = _session.BeginTransaction();
            _session.Save(user);
            tx.Commit();

            return Ok(new { user.Id, user.Nome, user.Email });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] UsuarioLoginDTO dto)
        {
            var user = _session.Query<Usuarios>().FirstOrDefault(u => u.Email.ToLower() == dto.Email.ToLower());
            if (user == null)
                return Unauthorized(new { error = "Credenciais inválidas" });
            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.SenhaHash))
                return Unauthorized(new { error = "Credenciais inválidas" });

            return Ok(new { user.Id, user.Nome, user.Email });
        }
    }
}