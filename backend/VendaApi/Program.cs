using FluentNHibernate.Cfg;
using FluentNHibernate.Cfg.Db;
using NHibernate;
using VendaApi.Mappings;
using VendaApi.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<ISessionFactory>(sp =>
{
    var connString = builder.Configuration
        .GetConnectionString("DefaultConnection");
    Console.WriteLine("CONN STRING: " + connString);

    return Fluently.Configure()
        .Database(PostgreSQLConfiguration.Standard
            .ConnectionString(connString)
        )
        .Mappings(m =>
        {
            m.FluentMappings.AddFromAssemblyOf<ClienteMap>();
            m.FluentMappings.AddFromAssemblyOf<UsuarioMap>();
        })
        .BuildSessionFactory();
});

builder.Services.AddScoped<NHibernate.ISession>(sp =>
    sp.GetRequiredService<ISessionFactory>().OpenSession()
);

builder.Services.AddScoped<IClientesService, ClientesService>();

builder.Services.AddCors(o =>
{
    o.AddPolicy("AllowReact", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowReact");

app.UseAuthorization();
app.MapControllers();

app.Run();
