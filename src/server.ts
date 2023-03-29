import { app, checkDatabaseConnection } from "./app";

async function init() {
    await checkDatabaseConnection();
    app.listen(4000, () => {
        console.log("Server launched successfully");
    })
}

init();