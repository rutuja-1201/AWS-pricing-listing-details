# AWS-pricing-listing-details
Fetch AWS pricing data from the AWS Price List API.
Store pricing data in a MySQL database for easy retrieval.
Retrieve AWS service prices for different regions.
Apply filters to narrow down pricing data based on service name, region, and price range.

Before you can run the AWS Pricing API, you need to have the following prerequisites installed:

Node.js (version 12 or higher)
MySQL database
npm (Node.js package manager)

#Clone the repository 
git clone https://github.com/yourusername/aws-pricing-api-node.git


#Install the required Node.js packages:
cd aws-pricing-api-node
npm install

#Initialize the databse 
mysql -u yourusername -p yourdatabase < sql 

#download the index.json file from this https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/using-ppslong.html
