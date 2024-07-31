import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../../usecontext/ProductContext';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Checkbox,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  Stack
} from '@chakra-ui/react';

const ProductForm = ({ isEdit }) => {
  const { nombre } = useParams(); // Usar nombre para buscar el producto
  const navigate = useNavigate();
  const { createProduct, updateProduct, fetchProductByName } = useProducts();
  const [product, setProduct] = useState({
    nombre: '',
    descripcion: '',
    imagen: '',
    precio: '',
    tipo: [],
    id_pokedex: '',
    peso: '',
    altura: '',
    estadisticas: [
      { nombre: 'hp', valor: '' },
      { nombre: 'attack', valor: '' },
      { nombre: 'defense', valor: '' },
      { nombre: 'special-attack', valor: '' },
      { nombre: 'special-defense', valor: '' },
      { nombre: 'speed', valor: '' },
    ],
    legendario: false,
    mythical: false,
    habilidades: [],
    ratio_captura: '',
    base_experience: '',
    likes: [
      { likesCount: 0, star: 0 }
    ]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (isEdit && nombre) {
        try {
          const productToEdit = await fetchProductByName(nombre); // Buscar por nombre
          setProduct(productToEdit);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching product!", error);
          setError('Error fetching product');
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [isEdit, nombre, fetchProductByName]);

  const handleChange = (e) => {
    const { name, value, type, checked, dataset } = e.target;
  
    if (type === 'checkbox') {
      setProduct({ ...product, [name]: checked });
    } else if (dataset.index !== undefined) {
      const index = Number(dataset.index);
      const field = dataset.field;
  
      setProduct(prevState => {
        const updatedArray = [...prevState[field]];
        updatedArray[index][name] = value;
        return { ...prevState, [field]: updatedArray };
      });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isEdit) {
        await updateProduct(product._id, product); // Usar '_id' para actualizar
      } else {
        await createProduct(product);
      }
      navigate(`/pokemon/${product.nombre}`);
    } catch (error) {
      console.error('Detailed error:', error);
      console.error('Error stack:', error.stack);
      setError(error.message || 'Error saving product!');
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={8}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box maxW="600px" mx="auto" p={4} borderWidth="1px" borderRadius="lg" boxShadow="md">
      <form onSubmit={handleSubmit}>
        {error && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}
        <Stack spacing={4}>
          <FormControl id="nombre" isRequired>
            <FormLabel>Nombre</FormLabel>
            <Input
              type="text"
              name="nombre"
              value={product.nombre}
              onChange={handleChange}
              placeholder="Nombre del producto"
            />
          </FormControl>
          <FormControl id="descripcion">
            <FormLabel>Descripción</FormLabel>
            <Textarea
              name="descripcion"
              value={product.descripcion}
              onChange={handleChange}
              placeholder="Descripción del producto"
            />
          </FormControl>
          <FormControl id="imagen">
            <FormLabel>Imagen URL</FormLabel>
            <Input
              type="text"
              name="imagen"
              value={product.imagen}
              onChange={handleChange}
              placeholder="URL de la imagen"
            />
          </FormControl>
          <FormControl id="precio" isRequired>
            <FormLabel>Precio</FormLabel>
            <Input
              type="number"
              name="precio"
              value={product.precio}
              onChange={handleChange}
              placeholder="Precio del producto"
            />
          </FormControl>
          <FormControl id="id_pokedex" isRequired>
            <FormLabel>ID Pokédex</FormLabel>
            <Input
              type="number"
              name="id_pokedex"
              value={product.id_pokedex}
              onChange={handleChange}
              placeholder="ID del Pokédex"
            />
          </FormControl>
          <FormControl id="peso">
            <FormLabel>Peso</FormLabel>
            <Input
              type="text"
              name="peso"
              value={product.peso}
              onChange={handleChange}
              placeholder="Peso del producto"
            />
          </FormControl>
          <FormControl id="ratio_captura">
            <FormLabel>Ratio de Captura</FormLabel>
            <Input
              type="number"
              name="ratio_captura"
              value={product.ratio_captura}
              onChange={handleChange}
              placeholder="Ratio de captura"
            />
          </FormControl>
          <FormControl id="base_experience">
            <FormLabel>Base Experience</FormLabel>
            <Input
              type="number"
              name="base_experience"
              value={product.base_experience}
              onChange={handleChange}
              placeholder="Base Experience"
            />
          </FormControl>
          <FormControl id="tipo">
            <FormLabel>Tipo</FormLabel>
            <Input
              type="text"
              name="tipo"
              value={product.tipo}
              onChange={handleChange}
              placeholder="Tipo del producto"
            />
          </FormControl>  
          <FormControl id="altura">
            <FormLabel>Altura</FormLabel>
            <Input
              type="text"
              name="altura"
              value={product.altura}
              onChange={handleChange}
              placeholder="Altura del producto"
            />
          </FormControl>
          <FormControl id="legendario">
            <FormLabel>Legendario</FormLabel>
            <Checkbox
              name="legendario"
              isChecked={product.legendario}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="mythical">
            <FormLabel>Mythical</FormLabel>
            <Checkbox
              name="mythical"
              isChecked={product.mythical}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="estadisticas">
            <FormLabel>Estadísticas</FormLabel>
            {product.estadisticas.map((stat, index) => (
              <Box key={index} mb={2}>
                <FormControl id={`estadisticas-${index}-nombre`}>
                  <FormLabel>Nombre</FormLabel>
                  <Input
                    type="text"
                    name="nombre"
                    value={stat.nombre}
                    data-index={index}
                    data-field="estadisticas"
                    onChange={handleChange}
                    placeholder="Nombre de la estadística"
                  />
                </FormControl>
                <FormControl id={`estadisticas-${index}-valor`}>
                  <FormLabel>Valor</FormLabel>
                  <Input
                    type="number"
                    name="valor"
                    value={stat.valor}
                    data-index={index}
                    data-field="estadisticas"
                    onChange={handleChange}
                    placeholder="Valor de la estadística"
                  />
                </FormControl>
              </Box>
            ))}
          </FormControl>
          <FormControl id="habilidades">
            <FormLabel>Habilidades</FormLabel>
            {product.habilidades.map((habilidad, index) => (
              <Box key={index} mb={2}>
                <FormControl id={`habilidades-${index}-nombre`}>
                  <FormLabel>Nombre</FormLabel>
                  <Input
                    type="text"
                    name="nombre"
                    value={habilidad.nombre}
                    data-index={index}
                    data-field="habilidades"
                    onChange={handleChange}
                    placeholder="Nombre de la habilidad"
                  />
                </FormControl>
                <FormControl id={`habilidades-${index}-descripcion`}>
                  <FormLabel>Descripción</FormLabel>
                  <Textarea
                    name="descripcion"
                    value={habilidad.descripcion}
                    data-index={index}
                    data-field="habilidades"
                    onChange={handleChange}
                    placeholder="Descripción de la habilidad"
                  />
                </FormControl>
              </Box>
            ))}
          </FormControl>
          <Button colorScheme="teal" type="submit" mt={4}>
            {isEdit ? 'Actualizar Producto' : 'Crear Producto'}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default ProductForm;
