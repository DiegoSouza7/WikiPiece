CREATE DATABASE animesworld;

CREATE TABLE imagens (
    "id" SERIAL,
    "nome" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE frutas (
    "id" SERIAL,
    "nome" TEXT NOT NULL UNIQUE,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "imagem_id" INTEGER NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_fruta_imagens FOREIGN KEY (imagem_id) REFERENCES imagens (id)
    ON DELETE CASCADE
);


CREATE TABLE tripulacao (
    "id" SERIAL,
    "nome" TEXT NOT NULL UNIQUE,
    "numero_membros" TEXT,
    "recompensa_total" TEXT,
    "descricao" TEXT,
    "imagem_id" INTEGER,
    PRIMARY KEY (id),
    CONSTRAINT fk_tripulacao_imagem FOREIGN KEY (imagem_id) REFERENCES imagens (id) 
    ON DELETE CASCADE
);

/* grupo: pirata, marinha etc 
    tipulação: qual bando pertence
    posição: o que faz no bando ou posição da marinha ou dentro de um reino
*/

CREATE TABLE personagens (
    "id" SERIAL,
    "nome" TEXT NOT NULL UNIQUE,
    "grupo" TEXT,
    "posicao" TEXT,
    "alcunha" TEXT,
    "descricao" TEXT NOT NULL,
    "altura" TEXT,
    "nasceu" TEXT,
    "status" TEXT,
    "possui_recompensa" BOOLEAN DEFAULT FALSE,
    "imagem_id" INTEGER,
    PRIMARY KEY (id),
    CONSTRAINT fk_personagens_imagem FOREIGN KEY (imagem_id) REFERENCES imagens (id) ON DELETE CASCADE
);

/* EVENTO QUE RESULTOU NO AUMENTO DA RECOMPENSA */
CREATE TABLE recompensas (
    "id" SERIAL,
    "valor" BIGINT,
    "personagem_id" INTEGER,
    "imagem_id" INTEGER,
    "evento" TEXT,
    PRIMARY KEY (id),
    CONSTRAINT fk_recompensa_personagem FOREIGN KEY (personagem_id) REFERENCES personagens (id),
    CONSTRAINT fk_recompensa_imagem FOREIGN KEY (imagem_id) REFERENCES imagens (id) ON DELETE CASCADE
);

CREATE TABLE personagens_frutas (
    "id" SERIAL,
    "personagem_id" INTEGER,
    "fruta_id" INTEGER,
    PRIMARY KEY (id),
    CONSTRAINT fk_personagem_fruta FOREIGN KEY (fruta_id) REFERENCES frutas (id),
    CONSTRAINT fk_fruta_personagem FOREIGN KEY (personagem_id) REFERENCES personagens (id)
);

CREATE TABLE personagens_tripulacao (
    "id" SERIAL,
    "personagem_id" INTEGER NOT NULL,
    "tripulacao_id" INTEGER NOT NULL,
    "tripulacao_atual" BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id),
    CONSTRAINT fk_tripulacao_personagem FOREIGN KEY (personagem_id) REFERENCES personagens (id),
    CONSTRAINT fk_personagem_tripulacao FOREIGN KEY (tripulacao_id) REFERENCES tripulacao (id)
);

CREATE TABLE users (
    "id" SERIAL,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "reset_token" TEXT,
    "reset_token_expires" TEXT,
    PRIMARY KEY (id)
);

DELETE FROM recompensas;
DELETE FROM personagens_frutas;
DELETE FROM personagens_tripulacao;
DELETE FROM personagens;
DELETE FROM tripulacao;
DELETE FROM frutas;
DELETE FROM imagens;

ALTER SEQUENCE recompensas_id_seq RESTART WITH 1;
ALTER SEQUENCE personagens_id_seq RESTART WITH 1;
ALTER SEQUENCE tripulacao_id_seq RESTART WITH 1;
ALTER SEQUENCE frutas_id_seq RESTART WITH 1;
ALTER SEQUENCE personagens_frutas_id_seq RESTART WITH 1;
ALTER SEQUENCE personagens_tripulacao_id_seq RESTART WITH 1;
ALTER SEQUENCE imagens_id_seq RESTART WITH 1;