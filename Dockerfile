FROM nginx:alpine

# Copy application files to nginx html directory
COPY ./app /usr/share/nginx/html

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose port 80
EXPOSE 80

# Use entrypoint to inject environment variables
ENTRYPOINT ["/entrypoint.sh"]
