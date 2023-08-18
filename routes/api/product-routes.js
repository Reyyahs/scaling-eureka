const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/products', async (req, res) => {
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
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
    try {
      const product = await Product.update(req.body, {
        where: {
          id: req.params.id,
        },
      });
    
      if (req.body.tagIds && req.body.tagIds.length) {
        const productTags = await ProductTag.findAll({
          where: { product_id: req.params.id },
        });
    
        const productTagIds = productTags.map(({ tag_id }) => tag_id);
        const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });
    
        const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
    
        await Promise.all([
          ProductTag.destroy({ where: { id: productTagsToRemove } }),
          ProductTag.bulkCreate(newProductTags),
        ]);
      }
    
      res.json(product);
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
