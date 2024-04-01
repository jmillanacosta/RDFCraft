FROM python:3.11-slim AS base
# Install dependencies

#RUN apk add --no-cache nodejs npm build-base openblas openblas-dev
RUN apt update && apt install -y build-essential libopenblas-dev nodejs npm wget default-jre

RUN npm i -g @rmlio/yarrrml-parser
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
# Copy source code
COPY exceptions/ ./exceptions
COPY helpers/ ./helpers
COPY models/ ./models
COPY routers/ ./routers
COPY services/ ./services
COPY utils/ ./utils
COPY bootstrap.py .
COPY main.py .
COPY logging_config.json .
COPY templates/ ./templates
# Download RMLMapper
RUN wget https://github.com/RMLio/rmlmapper-java/releases/download/v6.2.2/rmlmapper-6.2.2-r371-all.jar
RUN mkdir bin
RUN mv rmlmapper-6.2.2-r371-all.jar bin/mapper.jar
# Run the application
EXPOSE 8000

CMD ["python", "main.py"]