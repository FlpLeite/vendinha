# Vendinha
<img width="1863" height="970" alt="image" src="https://github.com/user-attachments/assets/c75fd1ea-21b3-4008-98bd-d6459af05477" />


**Sistema de controle de vendas fiado**

O objetivo deste projeto é o controle de contas de clientes de uma vendinha, facilitando o cadastro, consulta e gerenciamento de dívidas que antes eram anotadas no papel. O sistema permite que o dono da venda ou atendente cadastre clientes, registre dívidas, marque pagamentos e acompanhe o quanto cada cliente deve.

## Deploy DigitalOcean (Droplet Ubuntu 22.04, Nginx, Node, .NET)
> **Deploy hospedado no seguinte domínio:**
> [http://flprojects.me](http://flprojects.me)

---

## Tecnologias utilizadas

* **Back-end:** ASP.NET Core (C#) com NHibernate
* **Banco de dados:** PostgreSQL
* **Front-end:** ReactJS (HTML, CSS, JavaScript e Tailwind)

---

Este projeto possui um back-end em .NET e um front-end em React.
Abaixo estão descritas as bibliotecas principais utilizadas e o motivo da escolha de cada uma.

## Back-end (`backend/VendaApi`)

* **NHibernate** – ORM utilizado para mapear as entidades e realizar o acesso ao banco PostgreSQL.
* **Npgsql** – Driver que permite a conexão com o PostgreSQL.
* **Cpf.Cnpj** – Facilita a validação de números de CPF/CNPJ utilizados nos cadastros de clientes.
* **BCrypt.Net-Next** – Responsável pelo hash das senhas de usuários.
* **Swashbuckle.AspNetCore** – Gera a documentação Swagger da API para facilitar testes e integrações.

## Front-end (`frontend`)

* **React** – Biblioteca base para criação dos componentes de interface.
* **lucide-react** – Fornece os ícones utilizados na aplicação.
* **Vite** – Ferramenta de build e dev server para o projeto React.
* **Tailwind CSS**, **postcss** e **autoprefixer** – Geração de estilos utilitários e processamento de CSS.

## Organização do desenvolvimento

O desenvolvimento foi acompanhado e organizado pelo GitHub Projects:

* **Quadro de tarefas:**
  [https://github.com/users/FlpLeite/projects/4](https://github.com/users/FlpLeite/projects/4)

---

## Funcionalidades principais

* **Cadastro, consulta, edição e exclusão de clientes**
* **Cadastro de dívidas** (com valor, situação, descrição, data)
* **Marcação de dívidas como pagas**
* **Listagem de clientes ordenada por quem mais deve**
* **Busca de clientes por nome**
* **Paginação** (10 clientes por vez)
* **Idade do cliente** calculada automaticamente
* **Soma total das dívidas** exibida no homepage
* **Limite automático:** clientes não podem ter mais de R\$200 em dívidas abertas
* **Validações** de CPF e dados obrigatórios

---

## Documentação da API

A documentação completa da API está disponível em:

* [https://documenter.getpostman.com/view/44836960/2sB34kDysN](https://documenter.getpostman.com/view/44836960/2sB34kDysN)

---

## Como rodar o projeto

1. **Clone o repositório**
2. **Configure o banco de dados PostgreSQL** com o schema disponível em `vendinha/db_schema.sql`
3. **Preencha o arquivo `appsettings.json`** com as credenciais do seu banco/postgres
4. **Rode o backend** (`dotnet run`) e o **frontend** (`npm run dev`)
5. **Acesse** via [http://localhost:5173](http://localhost:5173) ou [http://flprojects.me](http://flprojects.me)

---
![Alt](https://repobeats.axiom.co/api/embed/0036e5e2b425d90adf244def995ac6e01ceee175.svg "Repobeats analytics image")
