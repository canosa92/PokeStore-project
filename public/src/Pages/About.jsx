import {
  Box,
  Container,
  Heading,
  Text,
  List,
  ListItem,
  ListIcon,
  VStack,
  Divider
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

const AboutPage = () => {
  return (
    <>
    <Container maxW="container.lg" py={10}>
      <Heading as="h1" size="xl" mb={6}>
        Sobre mí
      </Heading>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Perfil
          </Heading>
          <Text>
            ¡Con una amplia experiencia laboral en diversos sectores, he cultivado sólidas habilidades en
            atención al público, ventas y trabajo en equipo. He desempeñado roles que implican una
            interacción constante con clientes, lo que me ha permitido desarrollar un enfoque centrado en
            el servicio, la resolución de problemas y la colaboración efectiva.
            Sin embargo, mi búsqueda de crecimiento personal me llevó a descubrir una pasión latente por
            el desarrollo web. Al buscar un nuevo desafío que me permitiera materializar mis ideas y crear
            soluciones innovadoras, decidí sumergirme en el riguroso bootcamp de desarrollador FullStack
            en The Bridge. Durante este tiempo, adquirí habilidades en tecnologías como MongoDb, React,
            NodeJs, Express y MySQL. Esta experiencia me ha capacitado para adentrarme con entusiasmo
            en el mundo del desarrollo tecnológico.
          </Text>
        </Box>
        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Educación
          </Heading>
          <List spacing={3}>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              <Text as="span" fontWeight="bold">THE BRIDGE (2023 - 2024):</Text> Desarrollo Web Full Stack MERN
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              <Text as="span" fontWeight="bold">FREECODECAMP (2022 - 2023):</Text> Diseño Web Responsive, Algoritmos de Javascript y Estructura de Datos
            </ListItem>
          </List>
        </Box>
        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Proyectos
          </Heading>
          <List spacing={3}>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              <Text as="span" fontWeight="bold">Ecommerce de Pokemon (2024):</Text> Ofrece una experiencia de compra virtual centrada en el universo Pokémon. Utilizando
              tecnologías como Node.js, Express.js, MongoDB, React.js y Vite, la tienda ofrece una
              amplia gama de artículos, desde Pokemon hasta objetos de curación. Destacan su interfaz
              intuitiva, filtrado por categorías y detalles completos de cada producto. Además de el login y
              registro de usuarios, una cuenta admin para administrar los productos, editarlo y eliminarlo.
              <br />
              <a href="https://github.com/AlvaroMartin1981/PokeStore-project" target="_blank" rel="noopener noreferrer">GitHub - PokeStore</a>
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              <Text as="span" fontWeight="bold">Pokedex (2023):</Text> Desarrollé un buscador de Pokémon utilizando HTML, CSS y JavaScript. Utilizando la
              PokeAPI, diseñé una interfaz que permite buscar Pokémon por nombre, ver detalles como habilidades, estadísticas, entre otros.
            </ListItem>
          </List>
        </Box>
        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Aptitudes
          </Heading>
          <List spacing={3}>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              HTML, CSS, JavaScript, Git, Bootstrap
            </ListItem>
          </List>
        </Box>
        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Contacto
          </Heading>
          <Text>Teléfono: 677 73 97 60</Text>
          <Text>Email: adrian.canosa1992@gmail.com</Text>
          <Text>Ubicación: España</Text>
        </Box>
        <Divider />
        <Box>
          <Heading as="h1" size="xl" mb={6}>
            About Me
          </Heading>
          <Box>
            <Heading as="h2" size="lg" mb={4}>
              Profile
            </Heading>
            <Text>
              With extensive work experience in various sectors, I have cultivated strong skills in customer service, sales, and teamwork. I have held roles involving constant interaction with customers, which has allowed me to develop a service-oriented approach, problem-solving, and effective collaboration.
              However, my quest for personal growth led me to discover a latent passion for web development. Seeking a new challenge that would allow me to materialize my ideas and create innovative solutions, I decided to immerse myself in the rigorous FullStack developer bootcamp at The Bridge. During this time, I acquired skills in technologies such as MongoDb, React, NodeJs, Express, and MySQL. This experience has equipped me to enthusiastically delve into the world of technological development.
            </Text>
          </Box>
          <Box>
            <Heading as="h2" size="lg" mb={4}>
              Education
            </Heading>
            <List spacing={3}>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                <Text as="span" fontWeight="bold">THE BRIDGE (2023 - 2024):</Text> Full Stack Web Development MERN
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                <Text as="span" fontWeight="bold">FREECODECAMP (2022 - 2023):</Text> Responsive Web Design, JavaScript Algorithms, and Data Structures
              </ListItem>
            </List>
          </Box>
          <Box>
            <Heading as="h2" size="lg" mb={4}>
              Projects
            </Heading>
            <List spacing={3}>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                <Text as="span" fontWeight="bold">Pokemon Ecommerce (2024):</Text> Provides a virtual shopping experience centered on the Pokémon universe. Using technologies such as Node.js, Express.js, MongoDB, React.js, and Vite, the store offers a wide range of items, from Pokemon to healing items. Highlights include its intuitive interface, category filtering, and comprehensive product details. Additionally, user login and registration, an admin account to manage products, edit and delete them.
                <br />
                <a href="https://github.com/AlvaroMartin1981/PokeStore-project" target="_blank" rel="noopener noreferrer">GitHub - PokeStore</a>
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                <Text as="span" fontWeight="bold">Pokedex (2023):</Text> Developed a Pokémon search engine using HTML, CSS, and JavaScript. Using the PokeAPI, I designed an interface that allows you to search for Pokémon by name, view details such as abilities, stats, among others.
              </ListItem>
            </List>
          </Box>
          <Box>
            <Heading as="h2" size="lg" mb={4}>
              Skills
            </Heading>
            <List spacing={3}>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                HTML, CSS, JavaScript, Git, Bootstrap
              </ListItem>
            </List>
          </Box>
          <Box>
            <Heading as="h2" size="lg" mb={4}>
              Contact
            </Heading>
            <Text>Phone: 677 73 97 60</Text>
            <Text>Email: adrian.canosa1992@gmail.com</Text>
            <Text>Location: Spain</Text>
          </Box>
        </Box>
      </VStack>
    </Container>
    </>
  );
};

export default AboutPage;
