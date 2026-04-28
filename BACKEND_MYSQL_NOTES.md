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

Check saved users with:

```sql
SELECT * FROM handlooms.user;
```
