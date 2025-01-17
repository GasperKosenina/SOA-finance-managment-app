# slika, ki je osnova naši sliki. Oznaka pomeni različico, ki jo želimo uporabiti. Privzeto je latest.
FROM python:3.9-slim

# nastavi delovno mapo za vse ukaze RUN, CMD, ENTRYPOINT, COPY in ADD, ki sledijo. Lahko se zamenja večkrat.
WORKDIR /app

# skopira datoteke in mape iz naslova src na naslov dest v sliki
COPY requirements.txt .

# požene poljubni ukaz v izvajalnem okolju.
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# nastavi spremenljivko okolja (angl. environment variable) na določeno vrednost
ENV FLASK_APP=app.py
ENV FLASK_ENV=development

# sporoči Dockerju, da zabojnik posluša na določenih vratih (npr. 1234). To še ne naredi posameznih vrat dostopnih!
EXPOSE 5001

# privzeti ukaz, ki se požene ob zagonu zabojnika. Obstaja lahko le en tak ukaz.
CMD ["flask", "run", "--host=0.0.0.0", "--port=5001"]