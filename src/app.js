const express = require("express");

const app = express();

app.use(express.json());

app.use("/proyectos", require("./routes/proyectos"));
app.use("/desarrolladores", require("./routes/desarrolladores"));
app.use("/sprints", require("./routes/sprints"));
app.use("/bugs", require("./routes/bugs"));

app.listen(3000, () => {
    console.log("Servidor ejecutándose en puerto 3000");
});
