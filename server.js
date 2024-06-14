const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
// Importing the v4 function from the 'uuid' package
const { v4: uuid4 } = require('uuid');

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Mock user credentials (Replace with a proper authentication system)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

// List to store user data
const user_data = [];
// List to store raw materials
const raw_data = [];
// List to store product requests
const product_requests = [];

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/index.html"));
})

// Admin login route
app.route('/admin_login')
  .get((req, res) => {
    res.render('admin_login', { error: null });
  })
  .post((req, res) => {
    const { username, password } = req.body;
    let error = null;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Redirect to the admin page on successful login
      res.redirect('/admin_dashboard');
    } else {
      error = 'Invalid credentials. Please try again.';
      res.render('admin_login', { error });
    }
  });

// Admin dashboard route
app.route('/admin_dashboard')
  .get((req, res) => {
    res.render('admin_dashboard', { user_details: null, user_data });
  })
  .post((req, res) => {
    const { action } = req.body;
    let user_details = null;

    if (action === 'add_user') {
      // Process the form data and save it to the list
      const { name, location, account } = req.body;

      user_data.push({
        name,
        location,
        account,
      });
    } else if (action === 'view_user') {
      // Fetch user details based on the account number
      const { account_number } = req.body;

      const user = user_data.find(u => u.account === account_number);
      if (user) {
        user_details = {
          name: user.name,
          location: user.location,
          account: user.account,
        };
      }
    }

    res.render('admin_dashboard', { user_details, user_data });
  });

// Supplier dashboard route
app.route('/supplier_dashboard')
  .get((req, res) => {
    res.render('supplier_dashboard', { raw_materials: null, raw_data });
  })
  .post((req, res) => {
    const { action } = req.body;
    let raw_materials = null;

    if (action === 'add_raw_material') {
      // Process the form data and save it to the list
      const { description, quantity, transport_address } = req.body;

      raw_data.push({
        description,
        quantity,
        transport_address,
      });
    }

    res.render('supplier_dashboard', { raw_materials, raw_data });
  });

// Transporter dashboard route
app.route('/transporter_dashboard')
  .get((req, res) => {
    res.render('transporter_dashboard');
  })
  .post((req, res) => {
    const { action } = req.body;
    let raw_materials = null;

    if (action === 'add_raw_material') {
      // Process the form data and save it to the list
      const { description, quantity, transport_address } = req.body;

      raw_data.push({
        description,
        quantity,
        transport_address,
        // Generate a unique key using uuid
        key: uuid4(),
      });
    }

    res.render('supplier_dashboard', { raw_materials, raw_data });
  });

// Manufacturer dashboard route
app.route('/manufacturer_dashboard')
  .get((req, res) => {
    res.render('manufacturer_dashboard', { response: null });
  })
  .post((req, res) => {
    const { manufacturerAction, packageAddress, supplierAddress } = req.body;
    let response = null;

    if (manufacturerAction === 'request_product') {
      // Process the product request and add it to the list
      product_requests.push({
        packageAddress,
        supplierAddress,
      });

      response = 'Request sent to the supplier.';
    }

    res.render('manufacturer_dashboard', { response });
  });

/// Order route
app.route('/order')
.get((req, res) => {
  res.render('order');
})
.post((req, res) => {
  // Process the form data for the order (you can add logic here)
  const { packageAddress, transporterType, transporterAddress } = req.body;

  // Generate a unique key for the order using uuid
  const orderKey = uuid4();

  // Redirect to order confirmation page or perform additional logic
  res.render('order', { packageAddress, transporterType, transporterAddress, orderKey });
});

// Assuming 'product' is an object with temperature, boxStatus, and location properties
const product = {
  temperature: 25,  // Replace with the actual temperature value
  boxStatus: 'closed',  // Replace with 'open' or 'closed' based on the actual status
  location: 'Sensor Location',  // Replace with the actual location value
};

//pharmacy dashboard route
app.route('/pharmacy_dashboard')
  .get((req, res) => {
    res.render('pharmacy_dashboard', { raw_materials: null, raw_data });
  })
  .post((req, res) => {
    const { action } = req.body;
    let raw_materials = null;

    if (action === 'add_raw_material') {
      // Process the form data and save it to the list
      const { description, quantity, transport_address } = req.body;

      raw_data.push({
        description,
        quantity,
        transport_address,
      });
    }

    res.render('pharmacy_dashboard', { raw_materials, raw_data });
  });

app.get('/product_details', (req, res) => {
  res.render('product_details', { product });
});

// Generate and return a unique ID
app.post('/generateId', (req, res) => {
  const generatedId = uuid4();
  res.json({ generatedId });
});

const server = app.listen(5000, () => {
  console.log(`Server is running on port ${server.address().port}`);
});
