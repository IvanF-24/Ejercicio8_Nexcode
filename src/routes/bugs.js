const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");

const rutaBugs = path.join(
    __dirname,
    "../data/bugs.json"
);

function leerBugs() {

    if (!fs.existsSync(rutaBugs)) {
        fs.writeFileSync(
            rutaBugs,
            "[]"
        );
    }

    const data = fs.readFileSync(
        rutaBugs,
        "utf8"
    );

    if (!data.trim()) {
        return [];
    }

    return JSON.parse(data);
}

function guardarBugs(bugs) {

    fs.writeFileSync(
        rutaBugs,
        JSON.stringify(
            bugs,
            null,
            2
        )
    );
}

router.post("/", (req, res) => {

    const bugs = leerBugs();

    bugs.push(req.body);

    guardarBugs(bugs);

    res.status(201).json({
        mensaje: "Bug creado",
        bug: req.body
    });
});

router.get("/", (req, res) => {

    const bugs = leerBugs();

    res.json(bugs);
});

router.put("/:codigo", (req, res) => {

    const bugs = leerBugs();

    const bug = bugs.find(
        b => b.codigo == req.params.codigo
    );

    if (!bug) {
        return res.status(404).json({
            mensaje: "Bug no encontrado"
        });
    }

    Object.assign(
        bug,
        req.body
    );

    guardarBugs(bugs);

    res.json({
        mensaje: "Bug actualizado",
        bug
    });
});

router.delete("/:codigo", (req, res) => {

    let bugs = leerBugs();

    const existe = bugs.find(
        b => b.codigo == req.params.codigo
    );

    if (!existe) {
        return res.status(404).json({
            mensaje: "Bug no encontrado"
        });
    }

    bugs = bugs.filter(
        b => b.codigo != req.params.codigo
    );

    guardarBugs(bugs);

    res.json({
        mensaje: "Bug eliminado"
    });
});

module.exports = router;