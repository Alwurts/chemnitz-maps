# Chemnitz Maps

Submitted as requirement
for the class, Datenbanken und Web-Techniken

- Alejandro Wurts Santos
  - Web Engineering Master Student
  - Matriculation: 806215
- Technische Universität Chemnitz, Chemnitz, Deutschland

## Running the client

The client is a TypeScript application created with React and Vite. To run the client, you need to have [Node.js 18](https://nodejs.org/en/download/package-manager) or higher installed on your machine.

To run this project you need to setup a Google Maps API key, which in this case is already included in the .env file.

For this project the .env file is already included in the client folder with the following variables:

```env
VITE_MAPS_API_KEY=google_maps_api_key
VITE_API_URL=server_url
```

To run the client, you need to install the dependencies and run the development server:

```bash
cd client
npm install
npm run dev
```

After running the command, the client will be available at [http://localhost:3000](http://localhost:5173).

Exposing the application to the network is useful when you want to access the application from a different device, like a smartphone or tablet.

If you want to expose the application to the network, you can run the following command instead:

```bash
npm run dev-host
```

You will also need to update the server url in the client .env file to the IP address of the machine running the server.

```env
VITE_SERVER_URL=http://your-server-ip:8000
```

After running the command, the client will be available at [http://your-local-ip:5173](http://your-local-ip:5173).

> Note: If the client is using dev-host then the server should be using the `python manage.py runserver 0.0.0.0:8000` command to be able to access the API from the client.

## Running the server

The server is a Django application that provides a REST API. To run the server, you need to have [Python 3.12](https://www.python.org/downloads/release/python-3120/?ref=upstract.com) and [pipenv](https://pipenv.pypa.io/en/latest/installation.html) installed on your machine.

First create a pipenv environment and install the dependencies:

```bash
cd server
pipenv install
pipenv shell
```

Then run the server:

```bash
python manage.py runserver
```

If you want to expose the server to the network, you can run the following command instead:

```bash
python manage.py runserver 0.0.0.0:8000
```

> Note: If the server is exposed to the network, the client should be using the `npm run dev-host` command to be able to access the API from the client.

## Running the database

The Django project comes with a SQLite database which is located at `server/db.sqlite3`.
The included db.sqlite3 already contains the required migrations and data.

There are 3 users in the database, their login details are as follows:

- **Admin**: Has access to the Django admin panel
  ```json
  {
    "username": "admin",
    "password": "admin"
  }
  ```
- **Basic user**: User account of type basic
  ```json
  {
    "username": "user-basic",
    "password": "user-basic"
  }
  ```
- **Premium user**: User account of type premium
  ```json
  {
    "username": "user-premium",
    "password": "user-premium"
  }
  ```

### Creating a new database

If you want to start with a fresh database, you can delete the db.sqlite3 file and run the following commands:

```bash
# Create the database
python manage.py runserver
```

```bash
# Apply the migrations
python manage.py migrate
```

```bash
# Create a superuser
python manage.py createsuperuser
```

After the migrations are applied we can seed the database with the data from the Chemnitz City open data portal, run the following command to do so:

```bash
python manage.py import_chemnitz_data
```

> This command can also be used whenever you want to update the database with the data coming from the Chemnitz City open data portal.

## Endpoint list

Run the server and visit [http://localhost:8000/docs](http://localhost:8000/docs) to see the API documentation.
