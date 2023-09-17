const AWS = require('aws-sdk');
const axios = require('axios');
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const express = require('express');

const app = express();
const port = 3000;

// AWS credentials
AWS.config.update({
  accessKeyId: 'your access key',
  secretAccessKey: 'your secret key',
  region: 'us-east-1', // Choose your preferred region
});

// MySQL database connection details
const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: 'admin',
  database: 'pricedetails',
};

const readJsonFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading JSON file:', error);
    throw error;
  }
};

// Function to insert AWS pricing data into the MySQL database
const insertPricingData = async (data) => {
  const connection = await mysql.createConnection(dbConfig);

  for (const sku in data.products) {
    const product = data.products[sku];
    const attributes = product.attributes;

    // Handle undefined attributes by replacing them with null
    const serviceName = attributes.servicename || null;
    const location = attributes.location || null;
    const priceDimensions = attributes.pricePerUnit || null;
    const metadata = JSON.stringify(attributes) || null;

    try {
      // Insert data into your MySQL database tables as needed
      const insertQuery = 'INSERT INTO aws_services (id, service_name, region, pricing, metadata) VALUES (?, ?, ?, ?, ?)';
      await connection.execute(insertQuery, [sku, serviceName, location, priceDimensions, metadata]);
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  }

  await connection.end();
};

// API endpoint to get AWS pricing data with filtering
app.get('/prices', async (req, res) => {
  const { service, region, min_price, max_price } = req.query;
  const connection = await mysql.createConnection(dbConfig);

  try {
    // Build the SQL query with conditional filtering
    let selectQuery = 'SELECT * FROM aws_services WHERE 1';
    const params = [];

    if (service) {
      selectQuery += ' AND service_name = ?';
      params.push(service);
    }

    if (region) {
      selectQuery += ' AND region = ?';
      params.push(region);
    }

    if (min_price) {
      selectQuery += ' AND pricing >= ?';
      params.push(min_price);
    }

    if (max_price) {
      selectQuery += ' AND pricing <= ?';
      params.push(max_price);
    }

    const [rows] = await connection.execute(selectQuery, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await connection.end();
  }
});

// Read the JSON data from a file
const jsonFilePath = 'C:/Users/RUTUJA/Desktop/New folder/index(1).json';

(async () => {
  try {
    const jsonData = await readJsonFile(jsonFilePath);
    await insertPricingData(jsonData);
    console.log('Data insertion completed successfully.');
  } catch (error) {
    console.error('Data insertion failed:', error);
  }
})();

// Start the API server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
