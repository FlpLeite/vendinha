namespace VendaApi.Models
{
    public class Usuarios
    {
        public virtual int Id { get; set; }
        public virtual string Nome { get; set; } = null!;
        public virtual string Email { get; set; } = null!;
        public virtual string? Telefone { get; set; }
        public virtual string SenhaHash { get; set; } = null!;
    }
}