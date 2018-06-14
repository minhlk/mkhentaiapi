# MK Hentai API

Provide easy way to get list hentai update

## Getting Started

Before you start,these data are not mine,copyright to the respective owners

### Prerequisites

What things you need to install the software and how to install them

```
NodeJS
NPM
Account in MLab to create Mongo Database
Account in OpenShift to host this application
```

### Installing
Sign in to MLap and create Database

Get standard MongoDB URI from MLap


Sign in to OpenShift and set enviroment variables Console > Applications > Deployments > Environment

```
MONGO_DB_URL=MongoDB_URI
MOVIES_LIST=SITE_URL_MOVIE_LIST
HOME_URL=HOME_SITE_URL
```

Then deploy it 

## Built With

* [Node](https://github.com/nodejs/node) - ServerSide 
* [NPM](https://maven.apache.org/) - Some packages 

## Authors

* **MK Production** - *Initial work* - [MinhLK](https://github.com/minhlk)

## License

This project is licensed under the MIT License 

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc
