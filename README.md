# Theta
*A status manager and monitor, for everyone.*

## Features
* 🛹 Easy-to-use Platform designed from Scratch
* 🔒 Secure, allowing you to focus on monitoring and more.
* 📊 Real-time status updates
* 🛠️ Customizable service monitoring
* 📅 Task scheduling and incident reporting 
* 👥 Adding users.

## How to set up

### Prerequisites
- Node.js
- PostgreSQL
- Bun

### Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/l-mbda/theta.git
    cd theta
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

3. **Set up environment variables:**
    Create a `.env` file in the root directory and add the following:
    ```env
    PORT=3000
    DB_URL="your_postgresql_database_url"
    JWT_SECRET = "";
    ```

4. **Run database migrations:**
    ```sh
    npm run migrate
    ```

5. **Start the server:**
    - ***Development:***
        ```sh
        bun run dev
        ```
    - ***Production:***
       ```sh
       bun run app
       ```
       
       or (if you already built app)

       ```sh
       bun run start
       ```

### Configuring Allowed origins

To ensure your instance doesn't raise errors, visit the [NextJS Configuration File](/next.config.mjs) and add your URL to the allowedOrigins list on Line 10. This will prevent certain errors as a result of the application utilizing server actions.

## Usage

- Access the application at `http://localhost:3000` and connect it to the internet through your normal methods (NGINX, Apache)\*.

*\* Remember to configure the allowed origins before utilizing the instance.*

## License

Theta is licensed under the Mozilla Public License 2.0. See the [LICENSE](LICENSE) file for details.