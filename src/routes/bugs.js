const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");

const rutaBugs = path.join(
    __dirname,
    "../data/bugs.json"
);

const rutaProyectos = path.join(__dirname, "../data/proyectos.json");
const rutaDesarrolladores = path.join(__dirname, "../data/desarrolladores.json");

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

function leerProyectos() {
    if (!fs.existsSync(rutaProyectos)) {
        fs.writeFileSync(rutaProyectos, "[]");
    }

    const data = fs.readFileSync(rutaProyectos, "utf8");

    if (!data.trim()) return [];

    return JSON.parse(data);
}

function leerDesarrolladores() {
    if (!fs.existsSync(rutaDesarrolladores)) {
        fs.writeFileSync(rutaDesarrolladores, "[]");
    }

    const data = fs.readFileSync(rutaDesarrolladores, "utf8");

    if (!data.trim()) return [];

    return JSON.parse(data);
}

router.post("/", (req, res) => {

    // Validar existencia del proyecto
    const proyectos = leerProyectos();
    const proyecto = proyectos.find(p => p.codigo == req.body.proyectoCodigo);

    if (!proyecto) {
        return res.status(404).json({
            mensaje: "Proyecto no encontrado"
        });
    }

    // Validar existencia del desarrollador asignado
    const desarrolladores = leerDesarrolladores();
    const dev = desarrolladores.find(d => d.identificacion == req.body.desarrolladorAsignado);

    if (!dev) {
        return res.status(404).json({
            mensaje: "Desarrollador no encontrado"
        });
    }

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
