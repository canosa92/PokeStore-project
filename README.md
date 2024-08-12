# PokeStore

PokeStore is an e-commerce platform for purchasing Pokémon-related products. The platform allows users to browse and purchase various Pokémon items, manage their wishlist, and leave product reviews. It also includes an admin interface for managing products and orders.

![Homepage Screenshot](public/src/assets/Capturas/home.png)
![Homepage2](public/src/assets/Capturas/home_2.png)


## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Screenshots](#screenshots)

## Features

- **User Authentication**: Users can sign up, log in, and manage their profiles.
![Login](public/src/assets/Capturas/login.png)
![Register](public/src/assets/Capturas/register.png)
- **Product Management**: Admins can add, edit, and delete products.
![Cards Admin](public/src/assets/Capturas/cards_admin.png)
![edit_product](public/src/assets/Capturas/edit_product.png)
- **Shopping Cart**: Users can add products to their cart and proceed to checkout.
![shopping cart](public/src/assets/Capturas/shopping_cart.png)
![shopping page](public/src/assets/Capturas/carrito_entero.png)
- **Wishlist**: Users can add products to their wishlist.
![Lista Deseos Home](public/src/assets/Capturas/lista_deseos_home.png)
![Mi perfil favoritos](public/src/assets/Capturas/mi_perfil_favoritos.png)
- **Product Reviews**: Users can leave ratings and comments on products.
![Comentarios](public/src/assets/Capturas/comentarios_detail.png)
![Reseñas en mi perfil](public/src/assets/Capturas/reseñas-en-mi-perfil.png)
- **Responsive Design**: The platform is optimized for both desktop and mobile devices.

## Technologies Used

- **Frontend**:
  - React
  - Chakra UI
  - React Router
  - Context API for state management


- **Backend**:
  - Node.js
  - Express
  - MongoDB
  - Mongoose
  - Firebase 


- **Others**:
  - ESLint for code linting
  - Prettier for code formatting
  - Chat Gpt
  - Claude Ia

## Installation

To run this project locally, follow these steps:

### Prerequisites

- Node.js and npm installed on your machine
- MongoDB instance running locally or remotely

### Clone the Repository

```bash
git clone https://github.com/canosa92/PokeStore-project.git
cd PokeStore-project
```
## Deployment

To deploy the project, you can use the following script:

```bash
npm run dev
```

This command runs two processes concurrently:

npm run start: Starts the backend server.
npm run start:react: Starts the frontend development server.
This allows you to run both the frontend and backend servers simultaneously during development.


## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For any questions or suggestions, please reach out:

- **GitHub**: [canosa92](https://github.com/canosa92)
- **Email**: [adrian.canosa1992@gmail.com](mailto:adrian.canosa1992@gmail.com)
