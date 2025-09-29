const express = require('express');
const {loadContacts, findContact, addContact, checkDuplikat, deleteContact, updateContacts} = require('./utils/contact.js');
const {body, validationResult, check} = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const app = express();
const port = 3000;
const path = require('path');
const expressLayouts = require("express-ejs-layouts");

// set view engine ke ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set express ejs layouts
app.use(expressLayouts);
// Third party middleware
app.set('layout', 'layout/main-layouts')

// build in middleware(untuk membuka file statis)
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}));  
    
app.use(cookieParser('secret'));
app.use(session({
    cookie : {maxAge : 6000},
    secret : 'secret',
    resave : true,
    saveUninitialized : true
}))
app.use(flash())

app.get('/', (req,res) => {
    const data = [
        {
        nama : 'maulana',
        nim : 12233,
        email : 'aldinot56@gmail.com'        
        },
        {
        nama : 'reza',
        nim : 123753,
        email : 'aldiyes88@gmail.com'        
        }]
    res.render('index', {title : 'Home', data})
})
app.get('/about', (req,res) => {
    res.render('about.ejs', {title : 'About'})
})
app.get('/contact', (req,res) => {
    const contacts = loadContacts();
    res.render('contact.ejs', {title : 'Contact', contacts, msg : req.flash('msg')})
})
// add data
app.get('/contact/add', (req,res) => {
    res.render('add-contact', {
        title : 'Tambah Data Contact'
    })
})
// process add data
app.post('/contact',  
    [body('nama').custom(nama => {
        const duplikat = checkDuplikat(nama);
        if(duplikat){
            throw new Error('Nama contact sudah digunakan');
        }
        return true;
    }),
      check('email', 'Email tidak valid').isEmail(),
      check('nohp', 'No Hp tidak valid').isMobilePhone('id-ID')
    ]
, (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        // return res.status(400).json({errors : errors.array()})
        res.render('add-contact', {
            title : 'Tambah Data Contact',
            errors : errors.array()
        })
    }else{
        addContact(req.body);
        req.flash('msg', 'Data contact berhasil ditambahkan')
        res.redirect('/contact')
    }
})

// show detail someone
app.get('/contact/:nama', (req,res) => {
    const contact = findContact(req.params.nama);
    res.render('detail.ejs', {title : 'Detail', contact})
})


// delete contact
app.get('/contact/delete/:nama', (req,res) => {
    const contact = findContact(req.params.nama);

    if(!contact){
        res.status(404)
        res.send('<h1>404</h1>');
    }else {
        deleteContact(req.params.nama);
        req.flash('msg', 'Delete data contact is Success')
        res.redirect('/contact');
    }
})

// edit contact
app.get('/contact/edit/:nama', (req,res) => {
    const contact = findContact(req.params.nama);
    res.render('edit-contact', {
        title : 'Edit Data Contact', contact
    })
})

// process edit contact
app.post('/contact/update', [body('nama').custom((nama, {req}) => {
            const duplikat = checkDuplikat(nama);
            if(nama !== req.body.nama && duplikat){
                throw new Error('Nama contact sudah digunakan');
            }
            return true;
    }),
      check('email', 'Email tidak valid').isEmail(),
      check('nohp', 'No Hp tidak valid').isMobilePhone('id-ID')
    ]
, (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        // return res.status(400).json({errors : errors.array()})
        res.render('edit-contact', {
            title : 'Edit Data Contact',
            errors : errors.array(),
            contact : req.body
        })
    }else{
        updateContacts(req.body);
        req.flash('msg', 'Data contact berhasil diubah')
        res.redirect('/contact')
    }}
)

app.use('/', (req,res) => {
    res.status(404)
    res.send('<h1>404 Not Found</h1>');
})

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})