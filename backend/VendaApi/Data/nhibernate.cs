using NHibernate;
using NHibernate.Cfg;
using NHibernate.Dialect;
using NHibernate.Driver;
using Microsoft.Extensions.Configuration;

namespace VendaApi.Data
{
    public static class NHibernateHelper
    {
        private static ISessionFactory _factory;

        public static ISessionFactory CreateSessionFactory(IConfiguration config)
        {
            if (_factory != null) return _factory;

            var cfg = new Configuration();
            cfg.DataBaseIntegration(db =>
            {
                db.ConnectionString = config.GetConnectionString("DefaultConnection");
                db.Dialect<PostgreSQLDialect>();
                db.Driver<NpgsqlDriver>();
                db.SchemaAction = SchemaAutoAction.Validate;
            });

            _factory = cfg.BuildSessionFactory();
            return _factory;
        }
    }
}
