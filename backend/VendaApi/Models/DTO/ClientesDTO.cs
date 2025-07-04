using System;
using System.ComponentModel.DataAnnotations;

namespace VendaApi.Models.Dtos
{
    public class ClientesDTO
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "O NomeCompleto é obrigatório.")]
        [StringLength(100, ErrorMessage = "O NomeCompleto deve ter no máximo 100 caracteres.")]
        public string NomeCompleto { get; set; } = null!;

        [Required(ErrorMessage = "O CPF é obrigatório.")]
        [RegularExpression(@"^\d{11}$", ErrorMessage = "O CPF deve conter exatamente 11 dígitos numéricos.")]
        public string Cpf { get; set; } = null!;

        [Required(ErrorMessage = "A DataNascimento é obrigatória.")]
        public DateTime DataNascimento { get; set; }

        [EmailAddress(ErrorMessage = "O Email fornecido não é válido.")]
        public string? Email { get; set; }
    }
}