# Example

Its only needed if you don't use the `mxd-environment`.

```
require('mxd-swagger')(app, express);
```

The Swagger definition file should be located under `config/swagger.json`.


# Routes

* `/api-docs`: The swagger API documentation as JSON
* `/docs`: The swagger UI
