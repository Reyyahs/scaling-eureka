# Object-Relational Mapping (ORM)- E-commerce Back End


## Description


This online application enables users to interact with a database associated with an e-commerce platform. Through Insomnia and HTML routes, users can both access and make changes to the data. The core data pertains to the various categories, products, and tags associated with the available items for sale.


## Installation

This application will require Node.js to use. It will also require running "npm install" to pull in the express, mysql2, sequelize, and dotenv libraries into your environment.


## Usage

Utilize Insomnia to initiate fetch requests to various routes based on your intended actions. For accessing all categories, products, or tags, employ a GET route with the format http://localhost:3003/api/option_name, where 'option_name' corresponds to categories, products, or tags. Moreover, to retrieve a specific item from any of these categories, input the ID number along with the following GET route: http://localhost:3003/api/option_name/ID_number.

Furthermore, employ POST, PUT, and DELETE routes to make alterations within the database.

For inserting a novel item, use the POST route http://localhost:3003/api/option_name and provide JSON data. When updating an existing item, refer to the PUT route http://localhost:3003/option_name/ID_number and submit JSON data. Lastly, for removing an existing item, opt for the DELETE route http://localhost:3003/option_name/ID_number.


Object-Relational Mapping Video Demonstration: https://drive.google.com/file/d/15QUoQVMSnAcPrO0E7JxJGU3gkM1Afo_W/view

## Credits

N/A

## License
N/A