const ProductoModel= require('../models/ProductModel')


const productController = {
    // Obtener todos los productos
   async getAll  (req, res){
        try {
            const products = await ProductoModel.find();
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Obtener un producto por su ID
    async getById  (req, res){
        try {
            const product = await ProductoModel.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            res.json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Buscar productos por nombre
    async getProductsByName(req, res) {
        try {
            let nombre = req.params.nombre;
            nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
            const pokemon = await ProductoModel.findOne({ nombre: nombre }); 
            if (pokemon) {
                res.json(pokemon);
            } else {
                res.status(404).json({ message: "Producto no encontrado" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async update(req, res) {
        try {
          const { id } = req.params; // Obtener el ID de la ruta
          const updateData = req.body;
    
          const product = await ProductoModel.findByIdAndUpdate(id, updateData, { new: true });
    
          if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
          }
    
          res.json(product);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },
    // Eliminar un producto
    async delete(req, res) {
        try {
            const product = await ProductoModel.findByIdAndDelete(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            res.json({ message: 'Producto eliminado correctamente' });
            
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    

    // Crear un producto
    async create(req, res) {
        try {
            const {
                nombre,
                descripcion,
                imagen,
                precio,
                tipo,
                id_pokedex,
                peso,
                altura,
                estadisticas,
                legendario,
                mythical,
                habilidades,
                ratio_captura,
                base_experience,
            } = req.body;
             
            nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase(); 
            const newProduct = new ProductoModel({
                nombre,
                descripcion,
                imagen,
                precio,
                tipo,
                id_pokedex,
                peso,
                altura,
                estadisticas,
                legendario,
                mythical,
                habilidades,
                ratio_captura,
                base_experience,
            });

            await newProduct.save();
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = productController;
