const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  addProduct(product) {
    const products = this.getProducts();
    const newProduct = { id: this.generateId(products), ...product };
    products.push(newProduct);
    this.saveToFile(products);
    return newProduct;
  }

  getProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  getProductById(id) {
    const products = this.getProducts();
    const product = products.find(p => p.id === id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return product;
  }

  updateProduct(id, updatedFields) {
    const products = this.getProducts();
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw new Error('Producto no encontrado');
    }
    products[productIndex] = { ...products[productIndex], ...updatedFields };
    this.saveToFile(products);
    return products[productIndex];
  }

  deleteProduct(id) {
    const products = this.getProducts();
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw new Error('Producto no encontrado');
    }
    const deletedProduct = products.splice(productIndex, 1)[0];
    this.saveToFile(products);
    return deletedProduct;
  }

  generateId(products) {
    const maxId = products.reduce((max, product) => Math.max(max, product.id || 0), 0);
    return maxId + 1;
  }

  saveToFile(products) {
    fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
  }
}

// Ejemplo de uso
const productManager = new ProductManager('products.json');

const newProduct = {
  title: 'Producto Ejemplo',
  description: 'Esta es una descripción de un producto',
  price: 100,
  thumbnail: 'ruta/imagen.jpg',
  code: 'abc123',
  stock: 50
};

const addedProduct = productManager.addProduct(newProduct);
console.log('Producto agregado:', addedProduct);

console.log('Productos:', productManager.getProducts());

try {
  const productId = addedProduct.id;
  const product = productManager.getProductById(productId);
  console.log('Producto encontrado por ID:', product);
} catch (error) {
  console.error(error.message);
}

try {
  const productIdToUpdate = addedProduct.id;
  const updatedProduct = productManager.updateProduct(productIdToUpdate, {
    title: 'Producto Modificado',
    price: 150
  });
  console.log('Producto actualizado:', updatedProduct);
} catch (error) {
  console.error(error.message);
}

try {
  const productIdToDelete = addedProduct.id;
  const deletedProduct = productManager.deleteProduct(productIdToDelete);
  console.log('Producto eliminado:', deletedProduct);
} catch (error) {
  console.error(error.message);
}