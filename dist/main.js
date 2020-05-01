"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
        next();
    });
    app.enableCors();
    await app.listen(process.env.PORT || 3000, () => {
        console.log('listening on PORT: ' + (process.env.PORT || 3000));
    }).catch(err => console.log('error: ', err));
}
bootstrap();
//# sourceMappingURL=main.js.map