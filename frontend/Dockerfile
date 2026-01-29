FROM nginx:1.27-alpine

# Copy the source files into the default Nginx public directory
COPY index.html /usr/share/nginx/html/index.html
COPY app.js /usr/share/nginx/html/app.js
COPY style.css /usr/share/nginx/html/style.css

# Expose the port Nginx is configured to listen on
EXPOSE 80