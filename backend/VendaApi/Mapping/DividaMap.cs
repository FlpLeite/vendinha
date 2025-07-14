using FluentNHibernate.Mapping;
using VendaApi.Models;

namespace VendaApi.Mappings
{
    public class DividaMap : ClassMap<Dividas>
    {
        public DividaMap()
        {
            Table("dividas");

            Id(x => x.Id)
                .Column("id")
                .GeneratedBy.SequenceIdentity("dividas_id_seq");

            References(x => x.Cliente)
                .Column("cliente_id")
                .Not.Nullable()
                .Cascade.None();

            References(x => x.CriadoPor)
                .Column("criado_por_id")
                .Nullable()
                .Cascade.None();

            References(x => x.PagoPor)
                .Column("pago_por_id")
                .Nullable()
                .Cascade.None();

            Map(x => x.Valor)
                .Column("valor")
                .Not.Nullable();
            Map(x => x.Situacao)
                .Column("situacao")
                .Not.Nullable();
            Map(x => x.DataCriacao)
                .Column("data_criacao")
                .Not.Nullable();
            Map(x => x.DataPagamento)
                .Column("data_pagamento")
                .Nullable();
            Map(x => x.Descricao)
                .Column("descricao")
                .Nullable();
        }
    }
}
