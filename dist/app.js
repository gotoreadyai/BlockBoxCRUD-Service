"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const crudRoutes_1 = __importDefault(require("./routes/crudRoutes"));
const slugRoutes_1 = __importDefault(require("./routes/slugRoutes"));
const models_1 = require("./models");
const errorHandler_1 = require("./middleware/errorHandler");
const listRotues_1 = require("./utils/listRotues");
/* #PLUGINS IMPORTS */
const Routes_1 = __importDefault(require("./plugins/schoolBooksCascade/Routes"));
/* !#PLUGINS IMPORTS */
const app = (0, express_1.default)();
const cors = require("cors");
app.use(cors());
app.use(express_1.default.json());
app.use((0, crudRoutes_1.default)(models_1.Workspace, "workspace"));
app.use((0, crudRoutes_1.default)(models_1.Document, "document"));
app.use((0, crudRoutes_1.default)(models_1.User, "user"));
app.use((0, slugRoutes_1.default)(models_1.Workspace, 'workspace'));
app.use((0, slugRoutes_1.default)(models_1.Document, 'document'));
/* #PLUGINS */
app.use(Routes_1.default);
/* !#PLUGINS */
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT || 3000;
// Wyświetlenie kolorowych tras
(0, listRotues_1.listRoutes)(app);
db_1.default
    .sync()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error("Unable to connect to the database:", error);
});
