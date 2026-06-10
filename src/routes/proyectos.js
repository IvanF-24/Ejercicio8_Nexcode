const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");

const rutaProyectos = path.join(
    __dirname,
    "../data/proyectos.json"
);

function leerProyectos() {

    if (!fs.existsSync(rutaProyectos)) {
        fs.writeFileSync(rutaProyectos, "[]");
    }

    const data = fs.readFileSync(
        rutaProyectos,
        "utf8"
    );

    return JSON.parse(data);
}

function guardarProyectos(proyectos) {

    fs.writeFileSync(
        rutaProyectos,
        JSON.stringify(proyectos, null, 2)
    );
}

router.post("/", (req, res) => {

    const proyectos = leerProyectos();

    proyectos.push(req.body);

    guardarProyectos(proyectos);

    res.status(201).json({
        mensaje: "Proyecto creado",
        proyecto: req.body
    });
});

router.get("/", (req, res) => {

    const { estado, cliente, liderTecnico } = req.query;

    let resultado = leerProyectos();

    if (estado) {
        resultado = resultado.filter(
            p => p.estado === estado
        );
    }

    if (cliente) {
        resultado = resultado.filter(
            p => p.cliente === cliente
        );
    }

    if (liderTecnico) {
        resultado = resultado.filter(
            p => p.liderTecnico === liderTecnico
        );
    }

    res.json(resultado);
});

router.put("/:codigo", (req, res) => {

    const proyectos = leerProyectos();

    const proyecto = proyectos.find(
        p => p.codigo == req.params.codigo
    );

    if (!proyecto) {
        return res.status(404).json({
            mensaje: "Proyecto no encontrado"
        });
    }

    Object.assign(
        proyecto,
        req.body
    );

    guardarProyectos(proyectos);

    res.json({
        mensaje: "Proyecto actualizado",
        proyecto
    });
});

router.delete("/:codigo", (req, res) => {

    let proyectos = leerProyectos();

    const proyecto = proyectos.find(
        p => p.codigo == req.params.codigo
    );

    if (!proyecto) {
        return res.status(404).json({
            mensaje: "Proyecto no encontrado"
        });
    }

    if (proyecto.estado !== "cancelado") {
        return res.status(400).json({
            mensaje:
                "Solo se pueden eliminar proyectos cancelados"
        });
    }

    proyectos = proyectos.filter(
        p => p.codigo != req.params.codigo
    );

    guardarProyectos(proyectos);

    res.json({
        mensaje: "Proyecto eliminado"
    });
});

module.exports = router;