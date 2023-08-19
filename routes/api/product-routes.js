const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const dbProductData = await Product.findAll({
      include: [
        Category,
        {
          model: Tag,
          through: ProductTag,
          as: "tags",
        },
      ],
    });

    res.json(dbProductData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const dbProductData = await Product.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        Category,
        {
          model: Tag,
          through: ProductTag,
          as: "tags",
        },
      ],
    });
  
    if (!dbProductData) {
      res.status(404).json({ message: "Post Not Found" });
      return;
    }
  
    res.json(dbProductData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
  
});

// create new product
router.post('/', async (req, res) => {
  try {
    /* req.body should look like this...
      {
        product_name: "Basketball",
        price: 200.00,
        stock: 3,
        tagIds: [1, 2, 3, 4]
      }
    */

    const product = await Product.create(req.body);

    // if there are product tags, create pairings to bulk create in the ProductTag model
    if (req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });

      await ProductTag.bulkCreate(productTagIdArr);
    }

    // respond with the created product
    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    await product.update(req.body);

    if (req.body.tagIds && req.body.tagIds.length) {
      await ProductTag.destroy({ where: { product_id: product.id } });

      const productTagIdArr = req.body.tagIds.map((tag_id) => ({
        product_id: product.id,
        tag_id,
      }));

      await ProductTag.bulkCreate(productTagIdArr);
    }

    const updatedProduct = await Product.findByPk(req.params.id, {
      include: [
        Category,
        {
          model: Tag,
          through: ProductTag,
          as: "tags",
        },
      ],
    });

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const dbProductData = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
  
    if (!dbProductData) {
      res.status(404).json({ message: "No product found with this id" });
      return;
    }
  
    res.json(dbProductData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
  
});

module.exports = router;
