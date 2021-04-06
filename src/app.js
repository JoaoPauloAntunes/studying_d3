const express = require('express');



const app = express();
app.use('/static', express.static(`${__dirname}/static`));

app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/static/pages/index.html`);
});


app.listen(3000);