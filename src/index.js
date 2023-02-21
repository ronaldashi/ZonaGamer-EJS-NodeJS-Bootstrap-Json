const app = require('./app')


//Listening to the server
async function main() {
    await app.listen(app.get('port'));
    console.log('server on port', app.get('port'));
}
main();