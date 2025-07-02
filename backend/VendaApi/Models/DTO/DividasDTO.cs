namespace VendaApi.Models.Dtos
{
    public class DividasDto
    {
        public int Id { get; set; }
        public decimal Valor { get; set; }
        public bool Situacao { get; set; }
        public DateTime DataCriacao { get; set; }
        public DateTime? DataPagamento { get; set; }
        public string? Descricao { get; set; }
    }
}
