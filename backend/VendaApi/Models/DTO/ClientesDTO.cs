namespace VendaApi.Models.Dtos
{
    public class ClientesDto
    {
        public int Id { get; set; }

        public string NomeCompleto { get; set; } = null!;
        public string Cpf { get; set; } = null!;
        public DateTime DataNascimento { get; set; }
        public string? Email { get; set; }
    }
}