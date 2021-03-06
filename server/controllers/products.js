// import jwt from 'jsonwebtoken';
// import validateBody from '../../middleware/validate';
import connection from '../database/connection';

class productController {
  static create(request, response) {
    const { name, description, category, price, imageUrl } = request.body;

    if (!name) {
      return response.status(400).json({
        status: 400,
        error: 'Please provide the name of your product'
      });
    }

    if (!price) {
      return response.status(400).json({
        status: 400,
        error: 'Please provide the price of your product'
      });
    }

    const newProduct = {
      name,
      description,
      category,
      price,
      imageUrl
    };

    const query = `INSERT INTO products ("name",  "description", "category" ,"price", "imageUrl", "inStock") VALUES('${newProduct.name}','${newProduct.description}','${newProduct.category}','${newProduct.price}', '${newProduct.imageUrl}', 'true') returning * `;
    return connection
      .query(query)
      .then(result => {
        if (result.rowCount >= 1) {
          return response.status(201).send({
            status: 201,
            message: 'Product added successfully',
            data: result.rows[0]
          });
        }
      })
      .catch(error => {
        console.log(error);
        return response.status(500).send({
          status: 500,
          error:
            'Error adding product, ensure you provide valid product details'
        });
      });
  }

  static getAllProducts(request, response) {
    const query = 'SELECT * FROM products';
    return connection
      .query(query)
      .then(result => {
        if (result.rowCount === 0) {
          response.status(404).send({
            status: 404,
            error: 'There are no products records'
          });
        }
        return response.status(200).send({
          status: 200,
          message: 'Products successfully retrieved',
          data: result.rows
        });
      })
      .catch(error => {
        response.status(500).send({
          status: 500,
          error: 'Error fetching all products'
        });
      });
  }

  static deleteProduct(request, response) {
    const { product_id } = request.params;
    const query = `SELECT * FROM products WHERE "product_id"='${product_id}'`;
    return connection
      .query(query)
      .then(result => {
        if (result.rowCount === 0) {
          response.status(404).send({
            status: 404,
            error: 'Product does not exist'
          });
        }
        const deleteQuery = `DELETE FROM products WHERE "product_id"='${result.rows[0].product_id}'`;
        return connection
          .query(deleteQuery)
          .then(() =>
            response.status(200).send({
              status: 200,
              message: 'Product successfully deleted',
              data: result.rows[0]
            })
          )
          .catch(error => {
            response.status(500).send({
              status: 500,
              error: 'Error deleting the specific product'
            });
          });
      })
      .catch(error => {
        response.status(500).send({
          status: 500,
          error:
            'Error deleting the specific product, ensure you provide valid credentials'
        });
      });
  }

  static editProduct(request, response) {
    const { product_id } = request.params;
    const { name, description, category, price, imageUrl } = request.body;
    const query = `SELECT * FROM products WHERE "product_id"='${product_id}'`;
    return connection.query(query).then(result => {
      if (result.rowCount === 0) {
        response.status(404).send({
          status: 404,
          error: 'Product does not exist'
        });
      }

      const updateQuery = `UPDATE products SET "name"='${name}', "description"='${description}', "category"='${category}', "price"='${price}', "imageUrl"='${imageUrl}' WHERE "product_id"='${product_id}'`;
      return connection
        .query(updateQuery)
        .then(() =>
          response.status(200).send({
            status: 200,
            message: 'Product successfully updated',
            data: result.rows[0]
          })
        )
        .catch(error => {
          console.log(error);
          response.status(500).send({
            status: 500,
            error: 'Error updating the specific product'
          });
        });
    });
  }

  static sellProduct(request, response) {
    const { product_id } = request.params;
    const query = `SELECT * FROM products WHERE "product_id"='${product_id}'`;
    return connection.query(query).then(result => {
      if (result.rowCount === 0) {
        response.status(404).send({
          status: 404,
          error: 'Product does not exist'
        });
      }

      const updateQuery = `UPDATE products SET "inStock"='false' WHERE "product_id"='${product_id}'`;
      return connection
        .query(updateQuery)
        .then(() =>
          response.status(200).send({
            status: 200,
            message: 'Product is sold out',
            data: result.rows[0]
          })
        )
        .catch(error => {
          console.log(error);
          response.status(500).send({
            status: 500,
            error: 'Error selling the specific product'
          });
        });
    });
  }
}

export default productController;
