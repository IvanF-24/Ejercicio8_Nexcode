const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");

const rutaDesarrolladores = path.join(
    __dirname,
    "../data/desarrolladores.json"
);

function leerDesarrolladores() {

    if (!fs.existsSync(rutaDesarrolladores)) {
        fs.writeFileSync(
            rutaDesarrolladores,
            "[]"
        );
    }

    const data = fs.readFileSync(
        rutaDesarrolladores,
        "utf8"
    );

    if (!data.trim()) {
        return [];
    }

    return JSON.parse(data);
}

function guardarDesarrolladores(
    desarrolladores
) {

    fs.writeFileSync(
        rutaDesarrolladores,
        JSON.stringify(
            desarrolladores,
            null,
            2
        )
    );
}

router.post("/", (req, res) => {

    const desarrolladores =
        leerDesarrolladores();

    desarrolladores.push(req.body);

    guardarDesarrolladores(
        desarrolladores
    );

    res.status(201).json({
        mensaje:
            "Desarrollador creado",
        desarrollador: req.body
    });
});

router.get("/", (req, res) => {

    const desarrolladores =
        leerDesarrolladores();

    res.json(desarrolladores);
});

router.put("/:id", (req, res) => {

    const desarrolladores =
        leerDesarrolladores();

    const dev =
        desarrolladores.find(
            d =>
                d.identificacion ==
                req.params.id
        );

    if (!dev) {
        return res.status(404).json({
            mensaje:
                "Desarrollador no encontrado"
        });
    }

    Object.assign(
        dev,
        req.body
    );

    guardarDesarrolladores(
        desarrolladores
    );

    res.json({
        mensaje:
            "Desarrollador actualizado",
        desarrollador: dev
    });
});

router.delete("/:id", (req, res) => {

    let desarrolladores =
        leerDesarrolladores();

    const existe =
        desarrolladores.find(
            d =>
                d.identificacion ==
                req.params.id
        );

    if (!existe) {
        return res.status(404).json({
            mensaje:
                "Desarrollador no encontrado"
        });
    }

    desarrolladores =
        desarrolladores.filter(
            d =>
                d.identificacion !=
                req.params.id
        );

    guardarDesarrolladores(
        desarrolladores
    );

    res.json({
        mensaje:
            "Desarrollador eliminado"
    });
});

module.exports = router;