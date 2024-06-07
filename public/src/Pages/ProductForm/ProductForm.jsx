import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';

const ProductForm = ({ isEdit }) => {
  const { nombre } = useParams();
  const navigate = useNavigate();
  const { createProduct, updateProduct, fetchProductByName, products } = useProducts();
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
    cadena_evoluciones: [],
    evolucionDe: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (isEdit && nombre) {
        try {
          const data = await fetchProductByName(nombre);
          setProduct({
            nombre: data.nombre || '',
            descripcion: data.descripcion || '',
            imagen: data.imagen || '',
            precio: data.precio || '',
            tipo: data.tipo || [],
            id_pokedex: data.id_pokedex || '',
            peso: data.peso || '',
            altura: data.altura || '',
            estadisticas: data.estadisticas.map(est => ({ nombre: est.nombre, valor: est.valor })) || [],
            legendario: data.legendario || false,
            mythical: data.mythical || false,
            habilidades: data.habilidades || [],
            ratio_captura: data.ratio_captura || '',
            base_experience: data.base_experience || '',
            cadena_evoluciones: data.cadena_evoluciones || [],
            evolucionDe: data.evolucionDe || ''
          });
          setLoading(false);
        } catch (error) {
          console.error("Error fetching product!", error);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [isEdit, nombre, fetchProductByName]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setProduct({ ...product, [name]: checked });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await updateProduct(nombre, product);
      } else {
        await createProduct(product);
      }
      navigate('/');
    } catch (error) {
      setError('Error saving product!');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit">{isEdit ? 'Update Product' : 'Create Product'}</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default ProductForm;
