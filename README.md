# mandora-monitoring

Codebase for Mandora monitoring.

Supported functionality

- Time-series data storage in InfluxDB
- Import CSV files downloaded from [Itho Monitoring Portal](https://monitoring.ithodaalderop.nl/).

## Configuration

Configuration is stored in the modules found in `/config`.
Secrets such as InfluxDB database credentials are stored in a `.env` file (using [dotenv](https://github.com/motdotla/dotenv) npm module). See `.env.example` for an example configuration.

## Data Storage

The application stores time-series data from various inputs (Itho, Zeversolar, SmartDodos) retrieved via CSV or API in its data store.

### InfluxDB

An installation of [InfluxDB](https://docs.influxdata.com/influxdb) is required for the data store (see `/lib/data`). Make sure your InfluxDB is configured and running before you run this application. For more information about using InfluxDB with Node.js, see [influx-node](https://github.com/node-influx/node-influx).

## Authentication

The following services are authenticated with JSON Web Tokens ([JWT](https://jwt.io/)):

- InfluxDB (please note that [influx-node](https://github.com/node-influx/node-influx) does not support JWT, this means connections are made with username/password credentials)

### Authentication service

```
curl http://localhost:3000/api/auth/token -d username=<USERNAME> -d password=<PASSWORD>
{"jwt":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.he0ErCNloe4J7Id0Ry2SEDg09lKkZkfsRiGsdX_vgEg"}
```

### Accessing authenticated endpoints

#### Mandora API

```
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.he0ErCNloe4J7Id0Ry2SEDg09lKkZkfsRiGsdX_vgEg" https://monitoring.ecowijkmandora.nl/api/protected

{"jwt":"ok"}
```

#### InfluxDB HTTP services

You can test the authentication token by issueing a query to InfluxDB:

```
curl -G "https://monitoring.ecowijkmandora.nl/influx/query?db=test" --data-urlencode "q=SHOW DATABASES" --header "Authorization: Bearer
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.he0ErCNloe4J7Id0Ry2SEDg09lKkZkfsRiGsdX_vgEg"

{"results":[{"statement_id":0,"series":[{"name":"databases","columns":["name"],"values":[["_internal"],["mandora"]]}]}]}
```
