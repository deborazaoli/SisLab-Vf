
CREATE DATABASE sislab;
USE sislab;

-- =========================
-- USUÁRIO
-- =========================
CREATE TABLE usuario(
    idUsuario VARCHAR(10) PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(80) UNIQUE NOT NULL,
    senha VARCHAR(100),
    tipoUsuario ENUM(
        'servidor',
        'monitor',
        'administrador'
    ) NOT NULL
);

-- =========================
-- RECURSOS
-- =========================
CREATE TABLE recurso(
    idRecurso VARCHAR(10) PRIMARY KEY,

    nome VARCHAR(60) NOT NULL,

    tipoRecurso ENUM(
        'Sala',
        'Laboratório',
        'Equipamento'
    ) NOT NULL,

    capacidadePessoas INT,

    localizacao VARCHAR(80),

    observacao VARCHAR(150),

    codigoSeguranca VARCHAR(30),

    codigoValidade VARCHAR(30),

    statusRecurso ENUM(
        'disponivel',
        'manutencao',
        'indisponivel'
    ) DEFAULT 'disponivel'
);

-- =========================
-- RESERVAS
-- =========================
CREATE TABLE reserva(

    idReserva INT AUTO_INCREMENT PRIMARY KEY,

    codigoReserva VARCHAR(12) UNIQUE NOT NULL,

    responsavelNome VARCHAR(60) NOT NULL,

    responsavelMatricula VARCHAR(30) NOT NULL,

    reservaData DATE NOT NULL,

    horaRetirada TIME NOT NULL,

    horaDevolucao TIME NOT NULL,

    statusReserva ENUM(
        'ativa',
        'cancelada',
        'finalizada'
    ) DEFAULT 'ativa',

    idUsuario VARCHAR(10) NOT NULL,

    idRecurso VARCHAR(10) NOT NULL,

    FOREIGN KEY(idUsuario)
        REFERENCES usuario(idUsuario),

    FOREIGN KEY(idRecurso)
        REFERENCES recurso(idRecurso)
);

-- =========================
-- USUÁRIOS
-- =========================

INSERT INTO usuario VALUES

('U001','Administrador Geral','admin@sislab.com','123','administrador'),

('U002','Carlos Silva','carlos@if.edu','123','servidor'),

('U003','Maria Souza','maria@if.edu','123','monitor'),

('U004','Ana Clara','ana@if.edu','123','monitor'),

('U005','João Pedro','joao@if.edu','123','servidor');

-- =========================
-- RECURSOS
-- =========================

INSERT INTO recurso VALUES

('R001','Sala 201','Sala',40,'Bloco C','Projetor',NULL,NULL,'disponivel'),

('R002','Sala Multimídia','Sala',50,'Bloco A','TV Interativa',NULL,NULL,'disponivel'),

('R003','Lab Informática','Laboratório',30,'Bloco A','Computadores Novos',NULL,NULL,'disponivel'),

('R004','Lab Redes','Laboratório',20,'Bloco B','Cisco',NULL,NULL,'manutencao'),

('R005','Projetor Epson','Equipamento',NULL,'Coordenação','HDMI','SEG123','2027','disponivel'),

('R006','Notebook Dell','Equipamento',NULL,'TI','Core i5','SEG456','2028','disponivel');

-- =========================
-- RESERVAS
-- =========================

INSERT INTO reserva(

codigoReserva,
responsavelNome,
responsavelMatricula,
reservaData,
horaRetirada,
horaDevolucao,
statusReserva,
idUsuario,
idRecurso

)

VALUES

(

'ABC123',
'Carlos Silva',
'2025001',
'2026-06-26',
'08:00',
'10:00',
'ativa',
'U002',
'R001'

),

(

'LAB777',
'Maria Souza',
'2025002',
'2026-06-27',
'13:00',
'15:00',
'ativa',
'U003',
'R003'

),

(

'EQP456',
'Ana Clara',
'2025003',
'2026-06-28',
'09:00',
'11:00',
'ativa',
'U004',
'R005'

);