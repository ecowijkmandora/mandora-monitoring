# Mandora Monitoring API

Codebase for Mandora monitoring.

Supported functionality:

- Mandora Monitoring API
  - JSON Web Tokens (JWT) token generation for Mandora Monitoring API and InfluxDB endpoints
  - Import CSV files downloaded from [Itho Monitoring Portal](https://monitoring.ithodaalderop.nl/).
- Relational data (users, location, contact details, etc) storage in MySQL database
- Time-series data (energy, temperature, etc) storage in InfluxDB database

## Configuration

Configuration is stored in the modules found in `/config`.
Secrets such as InfluxDB and MySQL database credentials are stored in the `.env` file (using [dotenv](https://github.com/motdotla/dotenv) npm module). See `.env.example` for an example configuration.

## Data Storage

The application stores meta-data about monitored locations and time-series data from various inputs (Itho, Zeversolar, SmartDodos) retrieved via CSV or API in its data store. 

### Time-series data: InfluxDB 1.7

An installation of [InfluxDB](https://docs.influxdata.com/influxdb) is required for the data store (see `/lib/data`). Make sure your InfluxDB instance is configured, running, and accessible before you run this application. 
For more information about using InfluxDB with Node.js, see [influx-node module](https://github.com/node-influx/node-influx).

### Meta data: MySQL 8.0

The data store also requires an installation of [MySQL](https://dev.mysql.com/doc/refman/8.0/en/installing.html). Make sure your MySQL instance is configured, running, and accessible before you run this application.
For more information about using MuySQL with Node.js, see [mysql module](https://github.com/mysqljs/mysql).

## User authentication

The following services are authenticated with JSON Web Tokens ([JWT](https://jwt.io/)):
* Mandora Monitoring API
* InfluxDB (please note that [influx-node](https://github.com/node-influx/node-influx) does not support JWT, this means connections from the application itself are made with username/password credentials as configured in the `.env` file).

### Authentication service

Clients can obtain a JWT token using the authentication service of the Mandora Monitoring API: 

```
curl http://localhost:3000/api/auth/token -d username=<USERNAME> -d password=<PASSWORD>
{"jwt":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.he0ErCNloe4J7Id0Ry2SEDg09lKkZkfsRiGsdX_vgEg"}
```

### Accessing authenticated endpoints

After obtaining a JWT token, clients can connect to services are authenticated with JSON Web Tokens.

#### Mandora Monitoring API

When requesting data from the Mandora Monitoring API, append the token in the `Authorization` header of the HTTP-request:

```
curl https://localhost:3000/api/locations --header "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.he0ErCNloe4J7Id0Ry2SEDg09lKkZkfsRiGsdX_vgEg" 
```

#### InfluxDB HTTPS services

For the Influx HTTPS API, you should also append the token in the `Authorization` header of the HTTPS-request:

```
curl -G "https://localhost:8086/query?db=test" --data-urlencode "q=SHOW DATABASES" --header "Authorization: Bearer
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.he0ErCNloe4J7Id0Ry2SEDg09lKkZkfsRiGsdX_vgEg"

{"results":[{"statement_id":0,"series":[{"name":"databases","columns":["name"],"values":[["_internal"],["mandora"]]}]}]}
```

Privileged users can also use the InfluxDB CLI (`influx`) to connect to the database with their credentials. Append the `-ssl` option when InfluxDB is configured to use HTTPS endpoints:

```
$ influx -ssl -host 'localhost' -port 8086 -username '<USERNAME>' -password '<PASSWORD>'
Connected to https://localhost:8086 version 1.7.9
InfluxDB shell version: v1.7.9
>
```

## User authorization

Supported authorization levels:

- No access
- Anonymous reference data only (e.g. location UUIDs) - read-only
- Anonymous and protected reference data (e.g. location UUIDs and addresses) - read-only
- Anonymous, protected and private reference data (e.g. location UUIDs, addresses, and contact details) - read-only
- Anonymous, protected and private reference data (e.g. location UUIDs, addresses, and contact details) - read/write

## Extras

- See the [License](LICENSE.md) file for license rights and limitations (MIT).
- Pull Requests are welcome!