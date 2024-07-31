import { useState, useEffect } from 'react';
import { useProducts } from '../usecontext/ProductContext.jsx'; // Ajusta la ruta si es necesario
import Cards from '../Componentes/Cards/Cards.jsx';
import { Flex, Select, Text, Container, Button, HStack, Stack,Spinner } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

const AllProducts = () => {
    const { products, loading } = useProducts(); // Obtiene los productos del contexto y el estado de carga
    const [itemsPerPage, setItemsPerPage] = useState(50); // Valor predeterminado
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [order, setOrder] = useState('idAsc'); // Orden predeterminado
    const [sortedProducts, setSortedProducts] = useState([]);

    useEffect(() => {
        // Ordenar los productos cuando cambian los productos o el orden
        ordenarProductos(order);
    }, [products, order]);

    useEffect(() => {
        setTotalPages(Math.ceil(sortedProducts.length / itemsPerPage));
        setCurrentPage(1); // Reiniciar la página actual al cambiar la cantidad de productos por página
    }, [sortedProducts, itemsPerPage]);

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
    };

    const handleOrderChange = (e) => {
        setOrder(e.target.value);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const ordenarProductos = (tipoOrden) => {
        const sortedProducts = [...products];
        switch (tipoOrden) {
            case 'nombreAsc':
                sortedProducts.sort((a, b) => a.nombre.localeCompare(b.nombre));
                break;
            case 'nombreDesc':
                sortedProducts.sort((a, b) => b.nombre.localeCompare(a.nombre));
                break;
            case 'precioAsc':
                sortedProducts.sort((a, b) => a.precio - b.precio);
                break;
            case 'precioDesc':
                sortedProducts.sort((a, b) => b.precio - a.precio);
                break;
            case 'idAsc':
                sortedProducts.sort((a, b) => a.id_pokedex - b.id_pokedex);
                break;
            case 'idDesc':
                sortedProducts.sort((a, b) => b.id_pokedex - a.id_pokedex);
                break;
            case 'valorAsc':
                sortedProducts.sort((a, b) => a.likes[0].likes - b.likes[0].likes);
                break;
            case 'valorDesc':
                sortedProducts.sort((a, b) => b.likes[0].likes - a.likes[0].likes);
                break;
            default:
                break;
        }
        setSortedProducts(sortedProducts);
    };

    // Calcula el índice de inicio y fin de los productos para la página actual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = sortedProducts.slice(startIndex, endIndex);

    return (
        <Container maxW="container.xl" py={8}>
            <Stack spacing={6}>
                <Flex mb={4} align="center" justify="space-between">
                    <Flex align="center">
                        <Text mr={2} fontWeight="bold">Mostrar:</Text>
                        <Select
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                            maxW="150px"
                            w="auto"
                            size="lg"
                        >
                            <option value={50}>50 productos</option>
                            <option value={100}>100 productos</option>
                            <option value={200}>200 productos</option>
                            <option value={400}>400 productos</option>
                            <option value={800}>800 productos</option>
                            <option value={products.length}>Todos</option>
                        </Select>
                    </Flex>
                    <Flex align="center">
                        <Text mr={2} fontWeight="bold">Ordenar por:</Text>
                        <Select
                            value={order}
                            onChange={handleOrderChange}
                            maxW="200px"
                            w="auto"
                            size="lg"
                        >
                            <option value="nombreAsc">Nombre (A-Z)</option>
                            <option value="nombreDesc">Nombre (Z-A)</option>
                            <option value="precioAsc">Precio (Menor a Mayor)</option>
                            <option value="precioDesc">Precio (Mayor a Menor)</option>
                            <option value="idAsc">ID (Menor a Mayor)</option>
                            <option value="idDesc">ID (Mayor a Menor)</option>
                            <option value='valorAsc'>Valoraciones (Menor a Mayor)</option>
                            <option value='valorDesc'>Valoraciones (Mayor a Menor)</option>
                        </Select>
                    </Flex>
                </Flex>
                
                {/* Mostrar Spinner mientras se cargan los productos */}
                {loading ? (
                    <Flex justify="center" align="center" minHeight="200px">
                        <Spinner size="xl" />
                    </Flex>
                ) : (
                    <>
                        <Cards
                            products={currentProducts}
                            showSort={false} // No mostrar el selector de ordenamiento en el componente Cards
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                        <HStack spacing={4} justify="center" mt={6}>
                            <Button
                                onClick={() => handlePageChange(currentPage - 1)}
                                isDisabled={currentPage === 1}
                                variant="outline"
                                leftIcon={<ChevronLeftIcon />}
                            >
                                Anterior
                            </Button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <Button
                                    key={i + 1}
                                    onClick={() => handlePageChange(i + 1)}
                                    variant={i + 1 === currentPage ? 'solid' : 'outline'}
                                    colorScheme={i + 1 === currentPage ? 'blue' : 'gray'}
                                >
                                    {i + 1}
                                </Button>
                            ))}
                            <Button
                                onClick={() => handlePageChange(currentPage + 1)}
                                isDisabled={currentPage === totalPages}
                                variant="outline"
                                rightIcon={<ChevronRightIcon />}
                            >
                                Siguiente
                            </Button>
                        </HStack>
                    </>
                )}
            </Stack>
        </Container>
    );
};

export default AllProducts;
