namespace VendaApi.Models.Dtos
{
    public class ClientesListDto
    {
        public int Id { get; set; }
        public string NomeCompleto { get; set; } = null!;
        public string Cpf { get; set; } = null!;
        public DateTime DataNascimento { get; set; }
        public string? Email { get; set; }
        public int Age { get; set; }
        public decimal TotalDebt { get; set; }
    }
}