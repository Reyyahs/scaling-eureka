const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const dbCategoryData = await Category.findAll({
      include: [Product],
    });

    return res.json(dbCategoryData);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

router.get('/:id', async(req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const dbCategoryData = await Category.findOne({
      where: {
        id: req.params.id,
      },
      include: [Product],
    });

    if (!dbCategoryData) {
      return res.status(404).json({ message: "No category found with this id" });
    }

    return res.json(dbCategoryData);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const dbCategoryData = await Category.create({
      id: req.body.id,
      category_name: req.body.category_name
    });

    res.json(dbCategoryData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});






router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const [affectedRows] = await Category.update(
      {
        category_name: req.body.category_name
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    if (affectedRows === 0) {
      return res.status(404).json({ message: "No category found with this id" });
    }

    res.json({ message: "Category updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const deletedCategoryCount = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (deletedCategoryCount === 0) {
      return res.status(404).json({ message: "No category found with this id" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});


module.exports = router;
