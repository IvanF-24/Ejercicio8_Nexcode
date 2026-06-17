const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");

// Rutas a archivos de datos
const rutaSprints = path.join(__dirname, "../data/sprints.json");
const rutaProyectos = path.join(__dirname, "../data/proyectos.json");

function leerSprints() {
    if (!fs.existsSync(rutaSprints)) {
        fs.writeFileSync(rutaSprints, "[]");
    }

    const data = fs.readFileSync(rutaSprints, "utf8");

    if (!data.trim()) {
        return [];
    }

    return JSON.parse(data);
}

function guardarSprints(sprints) {
    fs.writeFileSync(rutaSprints, JSON.stringify(sprints, null, 2));
}

function leerProyectos() {
    if (!fs.existsSync(rutaProyectos)) {
        fs.writeFileSync(rutaProyectos, "[]");
    }

    const data = fs.readFileSync(rutaProyectos, "utf8");

    if (!data.trim()) {
        return [];
    }

    return JSON.parse(data);
}

// Crear sprint: validar existencia y estado del proyecto
router.post("/", (req, res) => {

    const proyectos = leerProyectos();

    const proyecto = proyectos.find(
        p => p.codigo == req.body.proyectoCodigo
    );

    // Validación: proyecto debe existir
    if (!proyecto) {
        return res.status(404).json({
            mensaje: "Proyecto no encontrado"
        });
    }

    // Validación: no crear sprints para proyectos entregados
    if (proyecto.estado === "entregado") {
        return res.status(400).json({
            mensaje: "No se pueden crear sprints para proyectos entregados"
        });
    }

    const sprints = leerSprints();

    sprints.push(req.body);

    guardarSprints(sprints);

    res.status(201).json(req.body);
});

router.get("/", (req, res) => {
    const sprints = leerSprints();
    res.json(sprints);
});

router.put("/:numero", (req, res) => {

    const sprints = leerSprints();

    const sprint = sprints.find(
        s => s.numero == req.params.numero
    );

    if (!sprint) {
        return res.status(404).json({
            mensaje: "Sprint no encontrado"
        });
    }

    Object.assign(sprint, req.body);

    guardarSprints(sprints);

    res.json(sprint);
});

router.delete("/:numero", (req, res) => {

    let sprints = leerSprints();

    sprints = sprints.filter(
        s => s.numero != req.params.numero
    );

    guardarSprints(sprints);

    res.json({
        mensaje: "Sprint eliminado"
    });
});

module.exports = router;
