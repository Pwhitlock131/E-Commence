const router = require('express').Router();
const { Product, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ["id", "product_name", "price", "stock", "category_id"],
      include: [
        { model: Tag, attributes: ["id", "tag_name"], through: ProductTag },
      ],
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Tag, attributes: ["id", "tag_name"], through: ProductTag },
      ],
    });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// create new product
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIds = req.body.tagIds.map((tag_id) => ({
        product_id: product.id,
        tag_id,
      }));
      await ProductTag.bulkCreate(productTagIds);
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

// update product
router.put('/:id', async (req, res) => {
  try {
    await Product.update(req.body, { where: { id: req.params.id } });
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTags = await ProductTag.findAll({
        where: { product_id: req.params.id },
      });
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => ({ product_id: req.params.id, tag_id }));

      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      await Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    }
    const updatedProduct = await Product.findByPk(req.params.id);
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Product.destroy({ where: { id: req.params.id } });
    res.json(`Product removed from database`);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

module.exports = router;
