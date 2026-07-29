FROM python:3.12-slim
WORKDIR /app
COPY docker /app/docker
RUN pip install --no-cache-dir gymnasium==0.29.1 numpy==1.26.4 || pip install gymnasium numpy
WORKDIR /app
