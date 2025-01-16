# Portfolio

This software allows people and institutions to setup an easy landingpage\homepage to show their portfolio. It's configured via an yaml file.

## Access
### Locale
[http://127.0.0.1:5000](http://127.0.0.1:5000)

## Configure
To configure this app create an config.yaml you can use config.sample.yaml as an example


## Administrate Docker
### Stop and Destroy
```bash 
docker stop landingpage
docker rm landingpage
```

### Build
```bash
docker build -t application-landingpage .
```

### Run

#### Run Development Environment
```bash
docker run -d -p 5000:5000 --name landingpage -v $(pwd)/app/:/app -e FLASK_APP=app.py -e FLASK_ENV=development application-landingpage
```

#### Run Production Environment
```bash
docker run -d -p 5000:5000 --name landingpage application-landingpage
```

### Debug
```bash
docker logs -f landingpage
```
## Author
This software was created from [Kevin Veen-Birkenbach](https://www.veen.world/).
