const express = require('express')
const app = express()
app.use(express.json());

const port = 3000


LICENSE_KEY_STORE = [{
        "license": "PRIVATE_LICENSE_KEY",
        "renewal": true,
        "discord": "XXXXXXXXXXXXXXXXXXXXX",
        "expire": "2022-01-01 00:00 UTC",
        "plan": "$60/6 months"
    },

    {
        "license": "PRIVATE_LICENSE_KEY2",
        "renewal": false,
        "discord": "647663506153275409",
        "expire": "2022-01-01 00:00 UTC",
        "plan": "Lifetime"
    },

    {
        "license": "PRIVATE_LICENSE_KEY3",
        "renewal": false,
        "discord": "575104533936603176",
        "expire": "2022-01-01 00:00 UTC",
        "plan": "Lifetime"
    }

]

PLANS = ["Lifetime", "$60/6 months", "Plan 3"]


API_KEY = "9SpuJJGlCHAg57b1THclkOBNAH7hkz"
API_SECRET = "SECRET"


app.post('/verify', (req, res) => {
    if (req.headers.authorization != API_KEY){
        res.status(401).send({
            "error": "Invalid API Key"
        })
        return;

    }
    if (req.body.secret_key != API_SECRET){
        res.status(401).send({
            'error': 'Invalid Secret Key'
        })
        return;

    }

    license = req.body.license
    discord = req.body.discord

    if (!LICENSE_KEY_STORE.find(o => o.license === license)) {
        res.status(404).send({
            'error': 'Key not found'
        })
        return;
    }

    if (LICENSE_KEY_STORE.find(o => o.license === license).discord !== discord) {
        res.status(404).send({
            'error': 'discord not found'
        })
        return;
    }

    license_data = LICENSE_KEY_STORE.find(o => o.license === license)


    res.status(200).send({
        'require_renewal': license_data.renewal,
        "expire_datetime": license_data.expire,
        "plan": license_data.plan
    })
})


app.post("/transfer", (req, res)=>{
    if (req.headers.authorization != API_KEY){
        res.status(401).send({
            "error": "Invalid API Key"
        })
        return;

    }
    if (req.body.secret_key != API_SECRET){
        res.status(401).send({
            'error': 'Invalid Secret Key'
        })
        return;

    }

    license = req.body.from_license
    discord = req.body.from_discord
    to_discord = req.body.to_discord

    if (!LICENSE_KEY_STORE.find(o => o.license === license)) {
        res.status(404).send({
            'error': 'Key not found'
        })
        return;
    }

    if (LICENSE_KEY_STORE.find(o => o.license === license).discord !== discord) {
        res.status(404).send({
            'error': 'discord not found'
        })
        return;
    }

    const new_license = Math.random().toString(36).substring(7);


    LICENSE_KEY_STORE.find(o=>o.license === license).license = new_license
    LICENSE_KEY_STORE.find(o=>o.license === new_license).discord = to_discord

    res.status(200).send({
        'discord': LICENSE_KEY_STORE.find(o=>o.license === new_license).discord,
        "license": LICENSE_KEY_STORE.find(o=>o.license === new_license).license,
        "plan": LICENSE_KEY_STORE.find(o=>o.license === new_license).plan
    })


})


app.get('/plan', (_, res)=> {
    res.status(200).send(PLANS)
})


app.listen(port, () => {
    console.log('BM DEV API')
})