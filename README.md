# Example

Its only needed if you don't use the `mxd-environment`.

```
require('mxd-swagger')(app, express);
```

The Swagger definition file should be located under `config/swagger.json` or `config/swagger.yml`.


# Routes

* `/api-docs`: The swagger API documentation as JSON or YML
* `/docs`: The swagger UI
