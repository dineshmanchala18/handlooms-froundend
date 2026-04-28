# Backend MySQL Notes

The Spring Boot backend is configured for:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/handlooms
spring.datasource.username=root
spring.datasource.password=
server.port=8081
```

To save users into MySQL, run the Spring Boot backend locally and use the Vite dev server so frontend requests go through the `/api` proxy to `http://localhost:8081`.

The Vercel frontend cannot write to `localhost:3306` on your computer. Vercel runs online, while your MySQL database is local to your laptop.

Local flow:

1. Start MySQL.
2. Make sure the `handlooms` schema exists.
3. Start the Spring Boot app on port `8081`.
4. Start the frontend with `npm run dev`.
5. Open the local Vite URL, create an account, then check MySQL.

For a deployed frontend, set `VITE_API_URL` to the public URL of your deployed Spring Boot backend. Do not set it to `localhost` on Vercel, because `localhost` would mean Vercel's server/browser context, not your laptop.

Check saved users with:

```sql
SELECT * FROM handlooms.user;
```

Main app actions now write through the Spring Boot backend:

```sql
SELECT * FROM handlooms.user;
SELECT * FROM handlooms.product;
SELECT * FROM handlooms.cart_item;
SELECT * FROM handlooms.payments;
SELECT * FROM handlooms.customer_order;
SELECT * FROM handlooms.customer_order_item;
```

If Spring Boot fails with `Access denied for user 'root'@'localhost'`, set `SPRING_DATASOURCE_PASSWORD` or update `spring.datasource.password` with your MySQL root password.
