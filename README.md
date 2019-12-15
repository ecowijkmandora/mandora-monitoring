# mandora-monitoring
Codebase for Mandora monitoring.

Supported functionality 
* Time-series data storage in InfluxDB
* Import CSV files downloaded from [Itho Monitoring Portal](https://monitoring.ithodaalderop.nl/).

## Data Storage

The application stores time-series data from various inputs (Itho, Zeversolar, SmartDodos) retrieved via CSV or API in its data store.

### InfluxDB

An installation of [InfluxDB](https://docs.influxdata.com/influxdb) is required for the data store (see `/lib/data`). Make sure your InfluxDB is configured and running before you run this application. For more information about using InfluxDB with Node.js, see [influx-node](https://github.com/node-influx/node-influx).

## Authentication

Services are authenticated with JSON Web Tokens ([JWT](https://jwt.io/)). To generate a JWT token, you need the to know the shared secret.

Generate a JWT token with the following payload/claim:

```
{
  "username": "my_username",
  "exp": 1609372800
}
```

Where `username` contains the username in InfluxDB, and `exp` contains the expiration date of the token. You can use an [online tool](https://www.unixtimestamp.com/index.php) to generate a timestamp and the [online JWT debugger](https://jwt.io/) to generate the token using the shared secret. 

You can test the authentication token by issueing a query to InfluxDB:

```
curl -G "http://localhost:8086/query?db=test" --data-urlencode "q=SHOW DATABASES" --header "Authorization: Bearer 
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.he0ErCNloe4J7Id0Ry2SEDg09lKkZkfsRiGsdX_vgEg"
```

