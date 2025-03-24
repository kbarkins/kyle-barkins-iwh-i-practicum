require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

// Middleware
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_TOKEN; // get private app access token from .env file not committed in github
const CUSTOM_OBJECT_ID = '2-42396586' // homes object type

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
// Homepage Route - GET request
app.get('/', async (req, res) => {
    // get all homes using search endpoint
    const homesURL = `https://api.hubspot.com/crm/v3/objects/${CUSTOM_OBJECT_ID}/search`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    
    const searchBody = {
        properties: ['hs_object_id', 'name', 'state', 'short_description'],
        limit: 100
    };
    
    try {
        const resp = await axios.post(homesURL, searchBody, { headers });
        const data = resp.data.results;
        console.log('API Response:', data); // Debug log
        res.render('homepage', { title: 'Homepage | Integrating With HubSpot I Practicum - Kyle Barkins', data });
    } catch (error) {
        console.error('Error details:', error.response?.data || error.message);
        res.status(500).send('Error fetching homes');
    }
})


// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.
// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 2 & 3 is below

// Routes for update custom object form
app.route('/update-cobj')
    .get((req, res) => {
        res.render('updates', { 
            title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
        });
    })
    .post(async (req, res) => {
        console.log('Received form data:', req.body); // Debug log
        
        const homesURL = `https://api.hubspot.com/crm/v3/objects/${CUSTOM_OBJECT_ID}`;
        const headers = {
            Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
            'Content-Type': 'application/json'
        }

        const properties = {
            name: req.body.name,
            street_address: req.body.street_address,
            state: req.body.state,
            short_description: req.body.short_description
        };

        try {
            const response = await axios.post(homesURL, { properties }, { headers });
            console.log('HubSpot API Response:', response.data); // Debug log
            res.redirect('/');
        } catch (error) {
            console.error('Error creating home:', error.response?.data || error.message);
            res.status(500).send('Error creating home: ' + (error.response?.data?.message || error.message));
        }
    });

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));