const { Router } = require('express');
const passport = require('passport');
const router = Router();

const fs = require('fs');
const readClients = fs.readFileSync('src/files/clients.json', 'utf-8');
const readInventory = fs.readFileSync('src/files/inventory.json', 'utf-8');
const readJobs = fs.readFileSync('src/files/jobs.json', 'utf-8');

let clients = JSON.parse(readClients);
let inventorys = JSON.parse(readInventory);
let jobs = JSON.parse(readJobs);

router.get('/', (req, res) => {
    res.render('index.ejs');
});

router.get('/consult', (req, res) => {
    res.render('consult.ejs');
});

router.get('/contact', (req, res) => {
    res.render('contact.ejs');
});

router.get('/register', (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect('/login');
    }
}, (req, res) => {
    res.render('register.ejs');
});

router.get('/add', (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect('/login');
    }
}, (req, res) => {
    res.render('add.ejs');
});

router.get('/delete', (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect('/login');
    }
}, (req, res) => {
    res.render('delete.ejs', {
        clients,
        inventorys,
        jobs
    });
});

router.get('/information', (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect('/login');
    }
}, (req, res) => {
    res.render('information.ejs', {
        clients,
        inventorys,
        jobs
    });
});

router.get('/login', (req, res) => {
    res.render('login.ejs');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: "/register",
    failureRedirect: "/login"
}));

router.get('/Logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});

router.post('/addClient', (req, res) => {
    const { nombre, apellido, documento } = req.body;

    if (!nombre || !apellido || !documento) {
        res.status(400).send('Datos invalidos');
        return;
    }

    let newClient = {
        "Nombre": nombre,
        "Apellido": apellido,
        "Documento": documento
    }

    const consulta = clients.find(lista => lista.Documento === documento);
    if (consulta) {
        res.status(400).send('<h1>El cliente ya existe</h1>');
    }
    else {
        clients.push(newClient);
    }

    const jsonClients = JSON.stringify(clients);
    fs.writeFileSync('src/files/clients.json', jsonClients, 'utf-8');


    res.redirect('/add');

});

router.post('/addInventory', (req, res) => {
    const { tipo, marca, referencia, serial, estado } = req.body;

    if (!tipo || !marca || !referencia || !serial || !estado) {
        res.status(400).send('Datos invalidos');
        return;
    }

    let newInventory = {
        "TipoDispositivo": tipo,
        "Marca": marca,
        "Referencia": referencia,
        "Serial": serial,
        "Estado": estado
    }

    const consulta = inventorys.find(lista => lista.Serial === serial);
    if (consulta) {
        res.status(400).send('<h1>El dispositivo ya existe<h1>');
    }
    else {
        inventorys.push(newInventory);
    }


    const jsonInventorys = JSON.stringify(inventorys);
    fs.writeFileSync('src/files/inventory.json', jsonInventorys, 'utf-8');


    res.redirect('/add');

});

router.post('/addWork', (req, res) => {
    const { id, serial, documento, descripcion, fecha, precio } = req.body;

    if (!id || !serial || !documento || !descripcion || !fecha || !precio) {
        res.status(400).send('Datos invalidos');
        return;
    }

    let newWork = {
        "Id": id,
        "SerialDispositivo": serial,
        "DocumentoCliente": documento,
        "Descripcion": descripcion,
        "Fecha": fecha,
        "Precio": precio
    }

    const consulta = jobs.find(lista => lista.Id === id);
    const consulta2 = inventorys.find(lista => lista.Serial === serial);
    const consulta3 = clients.find(lista => lista.Documento === documento);

    if (consulta) {
        res.status(400).send('<h1>El trabajo ya existe</h1>');
    }
    else {
        if (consulta2) {
            if (consulta3) {
                jobs.push(newWork);
            }
            else {
                res.status(400).send('<h1>El cliente no existe</h1>');
            }

        }
        else {
            res.status(400).send('<h1>El dispositivo no existe</h1>');
        }
    }


    const jsonWorks = JSON.stringify(jobs);
    fs.writeFileSync('src/files/jobs.json', jsonWorks, 'utf-8');


    res.redirect('/add');

});

router.get('/deleteClient/:documento', (req, res) => {
    clients = clients.filter(client => client.Documento != req.params.documento);
    const jsonClients = JSON.stringify(clients);
    fs.writeFileSync('src/files/clients.json', jsonClients, 'utf-8');
    res.redirect('/delete');
});

router.get('/deleteInventory/:serial', (req, res) => {
    inventorys = inventorys.filter(inv => inv.Serial != req.params.serial);
    const jsonInventorys = JSON.stringify(inventorys);
    fs.writeFileSync('src/files/inventory.json', jsonInventorys, 'utf-8');
    res.redirect('/delete');
});

router.get('/deleteWork/:id', (req, res) => {
    jobs = jobs.filter(job => job.Id != req.params.id);
    const jsonJobs = JSON.stringify(jobs);
    fs.writeFileSync('src/files/jobs.json', jsonJobs, 'utf-8');
    res.redirect('/delete');
});

router.post('/consultState', (req, res) => {
    const { serial } = req.body;
    consultSerial = inventorys.find(inv => inv.Serial === serial);
    if (consultSerial) {
        res.send('<h1>Tipo de Dispositivo: ' + consultSerial.TipoDispositivo +
            '<br>Marca: ' + consultSerial.Marca +
            '<br>Referencia: ' + consultSerial.Referencia +
            '<br>Serial: ' + consultSerial.Serial +
            '<br>Estado: ' + consultSerial.Estado + '</h1>'
        );
    }
    else {

        res.status(400).send('<h1>El dispositivo no existe</h1>');
    }
});


module.exports = router;


