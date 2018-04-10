# CSV import

It is a job interview test task.

Implement csv import with the possibility to search from imported data.
- Import form displays real-time progress.
- CSV file may contain millions of rows and can be large.
- Search field displays names in autocomplete manner and only 20 or less most related items.
- On clicking search result, displays all the data related to the item.
- User interface must be on one page, without any reloads. How it looks, is up to you.
- Frontend must be testable in a way that :
  - Import upload field has an id `uploadField` and submit button has id `uploadButton`
  - Search field has an id `searchField` and results have id `result-N` where N is the order of
item in search result list.
- API tests assume that:
  - GET / - Will display UI and all the frontend components mentioned above
  - POST /import - for file upload
  - GET /search?query='query' - returns
 `{"results": [{"id":id, "name": "name", "age": age, "address": "address", "team": "team"}]}`
 
## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.
See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You need Node.js >= 8.0.0.

You should have Docker installed.

### Running the app

Clone the repo

```
git clone https://github.com/kopylash/csv-import.git
```

To run the app with Docker
```
docker-compose build
docker-compose up
```

It will spawn app on `http://localhost/`, port 80, so it is nice to have it free.
Also, it will launch a container with Elasticsearch node and expose ports 9200 and 9300.

Then, open browser and go to `http://localhost/`. You can use example file for testing, called *testdata-errors.csv* and stored in sources.

**NOTE**: it may happen that your Docker configuration limits the memory dedicated to each container,
by default elasticsearch container uses up to 1Gb of memory. If it fails to start with 137 error code,
try changing "ES_JAVA_OPTS" in *docker-compose.yml*

### Development

```
npm i
```

To start server on port 8080 by default
```
npm start
```

To run frontend with webpack-dev-server on port 3000 by default
```
npm start:app
```

**Don't forget** to start Elasticsearch. You can configure the connection endpoint with `ELASTIC_URL` env variable.

## Comments on implementation
### Server
As CSV files can be very large I decided to process them in several steps.
First, upload them to the server and store in tmp location. On a successful upload, register a job in a queue.
There are workers that are subscribed to the queue events.

Worker implements a processing pipeline of 5 streams (file, parser, validator, converter, elastic). 
Stream API allows us to benefit from Node.js non-blocking I/O architecture
and not to consume a lot of memory storing the whole file in memory.
Worker uses custom stream implementations and processes the data even if there are some errors in the file.
It also updates the status of the job (which is stored in memory, for simplicity).

ElasticStream is a custom stream implementation that buffers objects into batches of 15000 documents and performs a bulk request to the Elasticsearch.
I found 15000 an optimal number, because objects to store are small. 
Additionally, I configured only 3 shards and 0 replicas for index as we are running a single node cluster. It is a point to discuss.

Currently there are 2 workers in a pool, but this of course can be customizable.
For better scaling, some production ready message brokers can be used.

Problem of uploading same file twice was out of the scope of this task, so it just stores same documents twice.
On each server restart I am recreating index.

**Why Elasticsearch?**

We need to perform a search over the "name" property of the object from a csv file.
Traditional databases could handle search if there will be not too many records. 
Indexing can help, but from my POV, Elasticsearch is much more scalable and reliable solution to implement search.
One day we would like to search over another field and so on. Then, indexing each field in RDBMS won't help anymore.
Elasticsearch analyzers can bring better autosuggest experience. Again, it is a point to discuss.

### Frontend
Implemented with React, used [material-ui](https://material-ui-next.com/) and [react-autosuggest](https://react-autosuggest.js.org/).

For simplicity decided to poll jobs status every 3s, thought that it will be too much to manage websockets for truly real-time progress.
User doesn't need such experience, considering the fact that processing of big csv files is not instant.

Haven't used Redux for simplicity as well, everything is on local state of top level components.

Using XHR for from uploading, because Fetch does not handle `multipart/form-data` uploading.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details



