namespace VendaApi.Models.Dtos
{
    public class UsuarioCadastroDTO
    {
        public string Nome { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Telefone { get; set; }
        public string Password { get; set; } = null!;
    }
}