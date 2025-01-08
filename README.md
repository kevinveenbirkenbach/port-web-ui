# homepage.veen.world

docker build -t flask-app .

docker run -d -p 5000:5000 --name landingpage flask-app

http://127.0.0.1:5000

sudo docker run -d -p 5000:5000 --name landingpage -v $(pwd)/app/:/app -e FLASK_APP=app.py -e FLASK_ENV=development flask-app