const express = require("express");
const router = express.Router();

let sprints = [];

router.post("/", (req, res) => {

    sprints.push(req.body);

    res.status(201).json(req.body);
});

router.get("/", (req, res) => {
    res.json(sprints);
});

router.put("/:numero", (req, res) => {

    const sprint = sprints.find(
        s => s.numero == req.params.numero
    );

    if (!sprint) {
        return res.status(404).json({
            mensaje: "Sprint no encontrado"
        });
    }

    Object.assign(sprint, req.body);

    res.json(sprint);
});

router.delete("/:numero", (req, res) => {

    sprints =
        sprints.filter(
            s => s.numero != req.params.numero
        );

    res.json({
        mensaje: "Sprint eliminado"
    });
});

module.exports = router;