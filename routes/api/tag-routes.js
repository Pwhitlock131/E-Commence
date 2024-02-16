const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: [{ model: Product, through: ProductTag }],
    });
    res.json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag }],
    });
    res.json(tag);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.post('/', async (req, res) => {
  try {
    const tag = await Tag.create({ tag_name: req.body.tag_name });
    res.json(tag);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.put('/:id', async (req, res) => {
  try {
    await Tag.update({ tag_name: req.body.tag_name }, { where: { id: req.params.id } });
    const updatedTag = await Tag.findByPk(req.params.id);
    res.json(updatedTag);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const qtyRemoved = await Tag.destroy({ where: { id: req.params.id } });
    res.json(`${qtyRemoved} tag was removed from the databse`);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

module.exports = router;
