CREATE TABLE cliente (
                         id SERIAL PRIMARY KEY,
                         nome_completo VARCHAR(100) NOT NULL,
                         cpf VARCHAR(11) NOT NULL UNIQUE,
                         data_nascimento DATE NOT NULL,
                         email VARCHAR(100)
);

CREATE TABLE divida (
                        id SERIAL PRIMARY KEY,
                        cliente_id INTEGER NOT NULL REFERENCES cliente(id) ON DELETE CASCADE,
                        valor NUMERIC(10,2) NOT NULL CHECK (valor > 0),
                        situacao BOOLEAN NOT NULL DEFAULT FALSE,
                        data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        data_pagamento TIMESTAMP,
                        descricao VARCHAR(255)
);

ALTER TABLE divida RENAME TO dividas;

ALTER SEQUENCE cliente_id_seq RENAME TO clientes_id_seq;
ALTER SEQUENCE divida_id_seq   RENAME TO dividas_id_seq;