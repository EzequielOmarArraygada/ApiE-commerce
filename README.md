API E-commerce

Este repositorio contiene una API para un sistema de comercio electrónico, desarrollada con Node.js, Express, MongoDB, y otras tecnologías modernas. Proporciona funcionalidades completas para la gestión de usuarios, productos, carritos de compra, y más.

Características

•	Gestión de Usuarios: Registro, inicio de sesión, y roles (usuario, administrador).
•	Productos: CRUD (Crear, Leer, Actualizar, Eliminar) de productos con categorías y búsqueda avanzada.
•	Carritos de Compra: Agregar, actualizar, y eliminar productos del carrito.
•	Pedidos: Procesamiento y gestión de pedidos.
•	Autenticación: JWT y Passport.js para la autenticación y autorización de usuarios.
•	Documentación API: Uso de Swagger para documentar y probar la API.

Tecnologías Utilizadas

•	Node.js
•	Express.js
•	MongoDB
•	Mongoose
•	JWT (JSON Web Tokens)
•	Passport.js
•	Swagger
•	Handlebars
•	CSS

Instalación

1.	Clona el repositorio:

git clone https://github.com/EzequielOmarArraygada/ApiE-commerce.git

2.	Navega al directorio del proyecto:

cd ApiE-commerce

3.	Instala las dependencias:

npm install

4.	Configura las variables de entorno: Crea un archivo .env en la raíz del proyecto y añade las siguientes variables:

PORT=8080
MONGODB_URI=
JWT_SECRET=

1.	Inicia el servidor:

npm start

2.	La API estará disponible en http://localhost:3000.

Rutas Principales

•	Usuarios:
o	POST /api/users/register: Registro de nuevo usuario.
o	POST /api/users/login: Inicio de sesión.
•	Productos:
o	GET /api/products: Obtener todos los productos.
o	POST /api/products: Crear un nuevo producto.
o	PUT /api/products/:id: Actualizar un producto.
o	DELETE /api/products/:id: Eliminar un producto.
•	Carritos:
o	GET /api/carts/:id: Obtener el carrito de un usuario.
o	POST /api/carts/:id/products: Agregar producto al carrito.
o	PUT /api/carts/:id/products/:productId: Actualizar cantidad de producto en el carrito.
o	DELETE /api/carts/:id/products/:productId: Eliminar producto del carrito.

Contacto

Para preguntas o sugerencias, por favor contacta a Ezequiel Omar Arraygada.

