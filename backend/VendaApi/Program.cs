using NHibernate;
using FluentNHibernate.Cfg;
using FluentNHibernate.Cfg.Db;
using VendaApi.Mappings;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton(factory =>
{
    var sessionFactory = Fluently.Configure()
        .Database(PostgreSQLConfiguration
            .Standard
            .ConnectionString(builder.Configuration.GetConnectionString("DefaultConnection"))
            .ShowSql())
        .Mappings(m =>
        {
            m.FluentMappings.AddFromAssemblyOf<ClienteMap>();
        })
        .BuildSessionFactory();
    return sessionFactory;
});

builder.Services.AddScoped(factory =>
{
    var sessionFactory = factory.GetRequiredService<ISessionFactory>();
    return sessionFactory.OpenSession();
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod());
});

builder.Services.AddScoped<IClientesService, ClientesService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
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
