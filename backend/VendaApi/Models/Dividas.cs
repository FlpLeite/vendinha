using System;

namespace VendaApi.Models
{
    public class Dividas
    {
        public virtual int Id { get; set; }
        public virtual Clientes Cliente { get; set; }
        public virtual Usuarios CriadoPor { get; set; }
        public virtual Usuarios? PagoPor { get; set; }
        public virtual decimal Valor { get; set; }
        public virtual bool Situacao { get; set; }
        public virtual DateTime DataCriacao { get; set; }
        public virtual DateTime? DataPagamento { get; set; }
        public virtual string? Descricao { get; set; }
    }
}
