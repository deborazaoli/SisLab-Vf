const express = require("express");
const router = express.Router();
const db = require("../db");

function gerarCodigoReserva() {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numeros = "0123456789";

  let codigo = "";

  for (let i = 0; i < 3; i++) {
    codigo += letras[Math.floor(Math.random() * letras.length)];
  }

  for (let i = 0; i < 3; i++) {
    codigo += numeros[Math.floor(Math.random() * numeros.length)];
  }

  return codigo;
}

router.get("/all", (req, res) => {
  const sql = `
    SELECT * FROM reserva
    ORDER BY reservaData, horaRetirada
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

router.get("/usuario/:id", (req, res) => {
  const sql = `
    SELECT * FROM reserva
    WHERE idUsuario = ?
    ORDER BY reservaData DESC
  `;

  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

router.post("/", (req, res) => {
  const {
    responsavelNome,
    responsavelMatricula,
    reservaData,
    horaRetirada,
    horaDevolucao,
    idUsuario,
    idRecurso
  } = req.body;

  if (!responsavelNome || !responsavelMatricula || !reservaData ||
      !horaRetirada || !horaDevolucao || !idUsuario || !idRecurso) {
    return res.status(400).json({ message: "Preencha todos os campos" });
  }

  const sqlConflito = `
    SELECT * FROM reserva
    WHERE idRecurso = ?
      AND reservaData = ?
      AND (? < horaDevolucao AND ? > horaRetirada)
  `;

  db.query(
    sqlConflito,
    [idRecurso, reservaData, horaRetirada, horaDevolucao],
    (err, conflito) => {
      if (err) return res.status(500).json(err);

      if (conflito.length > 0) {
        return res.status(409).json({ message: "Conflito de horário" });
      }

      const codigoReserva = gerarCodigoReserva();

      const sql = `
        INSERT INTO reserva (
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
        VALUES (?, ?, ?, ?, ?, ?, 'ativa', ?, ?)
      `;

      db.query(
        sql,
        [
          codigoReserva,
          responsavelNome,
          responsavelMatricula,
          reservaData,
          horaRetirada,
          horaDevolucao,
          idUsuario,
          idRecurso
        ],
        (err, result) => {
          if (err) return res.status(500).json(err);

          res.json({
            message: "Reserva criada",
            idReserva: result.insertId,
            codigoReserva
          });
        }
      );
    }
  );
});



router.put("/cancelar/:id", (req, res) => {
  const sql = `
    UPDATE reserva
    SET statusReserva = 'cancelada'
    WHERE idReserva = ?
  `;

  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Reserva cancelada" });
  });
});

router.put("/:id", (req, res) => {
  const {
    reservaData,
    horaRetirada,
    horaDevolucao
  } = req.body;

  const sql = `
    UPDATE reserva
    SET reservaData = ?,
        horaRetirada = ?,
        horaDevolucao = ?
    WHERE idReserva = ?
  `;

  db.query(
    sql,
    [reservaData, horaRetirada, horaDevolucao, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Reserva atualizada" });
    }
  );
});

module.exports = router;