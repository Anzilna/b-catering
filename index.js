const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose")
const multer = require('multer');
const bcrypt = require('bcrypt');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const packagedetailsmodel = require("./model/package");

const addressdetailsmodel = require("./model/address");
const Order = require('./model/Order');
const userlogins = require("./model/user");
const adminlogins = require("./model/login");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// DB Connection 
mongoose.connect("mongodb+srv://oxynoto:nextdone@cluster0.fz7wlul.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => { console.log("DB connected") })
    .catch(err => console.log(err));

// API creation
app.get('/', (request, response) => {
    response.send("Hai");
});

// API creation
app.get('/userlogin', (request, response) => {
    response.send("Hai");
});

//Food Items save

app.post('/ptnew', upload.single('image'), async (request, response) => {
    try {
        const { packid,
            packname,
            packtype,
            pprice,
            pdescription,
            status } = request.body
        const newdata = new packagedetailsmodel({
            packid,
            packname,
            packtype,
            pprice,
            pdescription,
            status,
            image: {
                data: request.file.buffer,
                contentType: request.file.mimetype,
            }
        })
        await newdata.save();

        res.status(200).json({ message: 'items added successfully' });
    }
    catch (error) {
        response.status(500).json({ error: 'Internal Server Error' });
    }
}
)

//Food Items edit

app.put('/ptedit/:id', upload.single('image'), async (request, response) => {

    try {
        const id = request.params.id;
        const { packid, packname, packtype, pprice, pdescription, status } = request.body;
        let result = null;
        if (request.file) {
            console.log("sdjfbjs")
            const updatedData = {
                packid,
                packname,
                packtype,
                pprice,
                pdescription,
                status,
                image: {
                    data: request.file.buffer,
                    contentType: request.file.mimetype,
                }

            };
            result = await packagedetailsmodel.findByIdAndUpdate(id, updatedData);
        }
        else {
            const updatedData = {
                packid,
                packname,
                packtype,
                pprice,
                pdescription,
                status,

            }
            result = await packagedetailsmodel.findByIdAndUpdate(id, updatedData);
        }


        if (!result) {
            return response.status(404).json({ message: 'Item not found' });
        }

        response.status(200).json({ message: 'Item updated successfully', data: result });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
});


//Food Items view

app.get('/ptview', async (request, response) => {
    var data = await packagedetailsmodel.find()
    response.send(data)
})

app.put('/ptupdatestatus/:id', async (request, response) => {
    let id = request.params.id
    await packagedetailsmodel.findByIdAndUpdate(id, { $set: { Status: "INACTIVE" } })
    response.send("Record Deleted")
})

//User Side
app.post("/userlogin", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userlogins.findOne({ email: email });

        if (user) {
            // Compare the password provided with the password stored in the database
            if (user.password === password) {
                res.json("success"); // Password matches, authentication successful
            } else {
                res.json("fail"); // Password does not match
            }
        } else {
            res.json("notexist"); // User does not exist
        }

    } catch (e) {
        console.error(e);
        res.json("error"); // Error occurred
    }
});


app.post("/signup", async (req, res) => {
    const { email, password } = req.body

    const data = {
        email: email,
        password: password
    }

    try {
        const check = await userlogins.findOne({ email: email })

        if (check) {
            res.json("exist")
        }
        else {
            res.json("notexist")
            await userlogins.insertMany([data])
        }

    }
    catch (e) {
        res.json("fail")
    }

})


// Assign port
app.listen(4005, () => {
    console.log("Port is running on 4005");
});

//save address

app.post('/cnew', async (request, response) => {
    try {
        new addressdetailsmodel(request.body).save();
        response.send("Record saved Sucessfully")
    }
    catch (error) {
        response.status(500).json({ error: 'Internal Server Error' });
    }
}
)

//address view

app.get('/addressview', async (req, res) => {
    // var data = await Order.find()
    // response.send(data)

    Order.aggregate([
        {
            $lookup: {
                from: "packages",
                localField: "product",
                foreignField: "_id",
                as: "product",
            }
        },
        // {

        //     $unwind: "$packages",
        // }
    ]).then(response => {
        console.log(response)
        res.status(200).json({ response })
    })

})

// app.put('/ptupdatestatus/:id', async (request, response) => {
//     let id = request.params.id
//     await addressdetailsmodel.findByIdAndUpdate(id, { $set: { Status: "INACTIVE" } })
//     response.send("Record Deleted")
// })


// Route to save the order
app.post('/api/saveOrder', async (req, res) => {
    try {

        console.log(req.body)

        const newOrder = new Order(req.body)

        newOrder.save().then(data => {
            console.log(data)
        })

        res.status(201).json({ message: 'Packages saved successfully', });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', error });
    }
});

//adimlogin
app.post("/", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await adminlogins.findOne({ email: email });

        if (user) {
            // Compare the password provided with the password stored in the database
            if (user.password === password) {
                res.json("success"); // Password matches, authentication successful
            } else {
                res.json("fail"); // Password does not match
            }
        } else {
            res.json("notexist"); // User does not exist
        }

    } catch (e) {
        console.error(e);
        res.json("error"); // Error occurred
    }
});



app.post("/adminregister", async (req, res) => {
    const { email, password } = req.body

    const data = {
        email: email,
        password: password
    }

    try {
        const check = await adminlogins.findOne({ email: email })

        if (check) {
            res.json("exist")
        }
        else {
            res.json("notexist")
            await adminlogins.insertMany([data])
        }

    }
    catch (e) {
        res.json("fail")
    }

})