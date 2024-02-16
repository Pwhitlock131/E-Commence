const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [Product],
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [Product],
    });
    res.json(category);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/', async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(200).json(newCategory);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.put('/:id', async (req, res) => {
  try {
    await Category.update(req.body, {
      where: { id: req.params.id },
    });
    const updatedCategory = await Category.findByPk(req.params.id);
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Category.destroy({
      where: { id: req.params.id },
    });
    res.json(`The category has been deleted from the database`);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
