namespace VendaApi.Models
{
    public class Clientes
    {
        public virtual int Id { get; set; }
        public virtual string NomeCompleto { get; set; }
        public virtual string Cpf { get; set; }
        public virtual DateTime DataNascimento { get; set; }
        public virtual string? Email { get; set; }

        public virtual IList<Dividas> Dividas { get; set; } = new List<Dividas>();
    }
}
