// swagger.js
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");


const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog API",
      version: "1.0.0",
      description:
        "RESTful API for Blog management with Users, Posts, Comments, Likes, Categories, Tags, Admin panel",
    },
    servers: [{ url: "http://localhost:5000/api" }],
  },
  apis: ["./routes/*.js"], // points to your route files
};

const specs = swaggerJsDoc(options);


const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};

module.exports = setupSwagger;
