FROM public.ecr.aws/lambda/nodejs:24

RUN dnf install -y \
    nss \
    libgbm \
    alsa-lib \
    dbus-libs \
    atk \
    at-spi2-atk \
    cups-libs \
    libXcomposite \
    libXdamage \
    libXrandr \
    gtk3 \
    libxkbcommon \
    pango \
    mesa-libgbm \
    && dnf clean all \
    && rm -rf /var/cache/dnf/*

COPY ./app ${LAMBDA_TASK_ROOT}/
WORKDIR ${LAMBDA_TASK_ROOT}

# Install with production flag
RUN npm install --production --omit=dev

# Install only chromium headless shell (smaller)
RUN PLAYWRIGHT_BROWSERS_PATH=/root/.cache/ms-playwright \
    npx playwright install chromium-headless-shell

CMD ["index.handler"]
