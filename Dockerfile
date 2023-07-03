FROM alpine

# Installs latest Chromium package.
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      yarn

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Installing Puppeteer.
RUN yarn add puppeteer

# Add user so we don't need --no-sandbox.
RUN addgroup -S pptrusr && adduser -S -G pptrusr pptrusr \
    && mkdir -p /home/pptrusr/Downloads /app \
    && chown -R pptrusr:pptrusr /home/pptrusr \
    && chown -R pptrusr:pptrusr /app

# Run everything after as non-privileged user.
USER pptrusr

# Install NPM dependencies for function
RUN npm install

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "index.js" ]