using FluentNHibernate.Mapping;
using VendaApi.Models;

namespace VendaApi.Mappings
{
    public class ClienteMap : ClassMap<Clientes>
    {
        public ClienteMap()
        {
            Table("clientes");

            Id(x => x.Id)
                .Column("id")
                .GeneratedBy.SequenceIdentity("clientes_id_seq");

            Map(x => x.NomeCompleto)
                .Column("nome_completo")
                .Not.Nullable();
            Map(x => x.Cpf)
                .Column("cpf")
                .Not.Nullable()
                .Unique();
            Map(x => x.DataNascimento)
                .Column("data_nascimento")
                .Not.Nullable();
            Map(x => x.Email)
                .Column("email")
                .Nullable();

            HasMany(x => x.Dividas)
                .KeyColumn("cliente_id")
                .Cascade.AllDeleteOrphan()
                .Inverse();
        }
    }
}
