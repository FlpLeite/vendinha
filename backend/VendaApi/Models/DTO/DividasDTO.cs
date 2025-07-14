using System;
using System.ComponentModel.DataAnnotations;

namespace VendaApi.Models.Dtos
{
    public class DividasDTO
    {
        public int Id { get; set; }
        public int ClienteId { get; set; }
        public string? ClienteNome { get; set; }
        public int CriadoPorId { get; set; }
        public int? PagoPorId { get; set; }

        [Required(ErrorMessage = "O Valor da dívida é obrigatório.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "O Valor deve ser maior que zero.")]
        public decimal Valor { get; set; }
        public bool Situacao { get; set; }
        public DateTime DataCriacao { get; set; }
        public DateTime? DataPagamento { get; set; }
        [StringLength(255, ErrorMessage = "A Descricao deve ter no máximo 255 caracteres.")]
        public string? Descricao { get; set; }
    }
}
