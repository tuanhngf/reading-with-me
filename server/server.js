const app = require('./src/app');
const configs = require('./src/configs');

const PORT = configs.db.port;

const server = app.listen(PORT, () => {
    console.log(`ReadingWithMe start ${PORT}`);
});
