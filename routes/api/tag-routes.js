const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const dbTagData = await Tag.findAll({
      include: [
        {
          model: Product,
          through: ProductTag,
          as: "products",
        },
      ],
    });
  
    res.json(dbTagData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }  
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const dbTagData = await Tag.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: Product,
          through: ProductTag,
          as: "products",
        },
      ],
    });
  
    if (!dbTagData) {
      res.status(404).json({ message: "No tag found with this id" });
      return;
    }
  
    res.json(dbTagData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
  
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const dbTagData = await Tag.create({
      id: req.body.id,
      tag_name: req.body.tag_name,
    });
  
    res.json(dbTagData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
  
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const [rowsUpdated, dbTagData] = await Tag.update(
      {
        tag_name: req.body.tag_name,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
  
    if (rowsUpdated === 0) {
      res.status(404).json({ message: "No tag found with this id" });
      return;
    }
  
    res.json(dbTagData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
  
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const rowsDeleted = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
  
    if (rowsDeleted === 0) {
      res.status(404).json({ message: "No tag found with this id" });
      return;
    }
  
    res.json({ message: "Tag deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
  
});

module.exports = router;
