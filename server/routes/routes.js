// import other routes
const logRoutes = require('./log');

const appRouter = (app, fs) => {

    // default route
    app.get("/", function(req, res) {
        res.sendFile("C:\\Users\\guney\\OneDrive\\Masaüstü\\soa\\home.html");
    });

    // // other routes
    logRoutes(app, fs);

};

module.exports = appRouter;