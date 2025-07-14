using FluentNHibernate.Mapping;
using VendaApi.Models;

namespace VendaApi.Mappings
{
    public class UsuarioMap : ClassMap<Usuarios>
    {
        public UsuarioMap()
        {
            Table("usuarios");

            Id(x => x.Id)
                .Column("id")
                .GeneratedBy.SequenceIdentity("usuarios_id_seq");

            Map(x => x.Nome)
                .Column("nome")
                .Not.Nullable();
            Map(x => x.Email)
                .Column("email")
                .Not.Nullable()
                .Unique();
            Map(x => x.Telefone)
                .Column("telefone")
                .Nullable();
            Map(x => x.SenhaHash)
                .Column("senha_hash")
                .Not.Nullable();
        }
    }
}