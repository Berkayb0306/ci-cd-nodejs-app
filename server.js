const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:8081",
};

app.use(cors(corsOptions));

// Parse requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basit rota
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// Eğer tutorial.routes.js dosyasını kullanmaya devam edecekseniz, bu satırı koruyun
// require("./app/routes/tutorial.routes.js")(app);


const usersRouter = require("./app/routes/users");
app.use("/users", usersRouter);

// Port ayarı
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Internal Server Error" });
});

// Export app (optional)
module.exports = app;
