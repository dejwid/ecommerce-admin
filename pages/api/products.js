import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === "GET") {
    if (req.query?.id) {
      const product = await Product.findOne({ _id: req.query.id });
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ message: "Produto não encontrado." });
      }
    } else {
      const products = await Product.find();
      res.status(200).json(products);
    }
  }

  if (method === "POST") {
    const { title, description, price, images, category, properties } =
      req.body;
    const productDoc = await Product.create({
      title,
      description,
      price,
      images,
      category,
      properties,
    });
    res.status(201).json(productDoc);
  }

  if (method === "PUT") {
    const { title, description, price, images, category, properties, _id } =
      req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      _id,
      { title, description, price, images, category, properties },
      { new: true }
    );

    if (updatedProduct) {
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ message: "Produto não encontrado." });
    }
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      const deletedProduct = await Product.findByIdAndRemove(req.query.id);
      if (deletedProduct) {
        res.status(200).json({ message: "Produto excluído com sucesso." });
      } else {
        res.status(404).json({ message: "Produto não encontrado." });
      }
    }
  }
}
