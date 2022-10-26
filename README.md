## TODO:
- - [ ] finish gcp deployment
- - [ ] link to managed gcp postgres
- - [ ] add security rules to firestore
- - [ ] more tests
- - [ ] more error handling
- - [x] CI/CD
- - [ ] dockerize all the things with firebase emulators
- - [x] db
- - [x] app
- - [ ] fix failing docker-compose running app due OpenApi error
- - [ ] add missing swagger docs

### to run the app localy
`npm install && npm run start`
or
`start:dev`
or
`start:debug`
- local postgres is expected

### to see api documentation, to to `your-url:port/api`

### to run e2e scripts against docker database run
<`npm run test:e2e:docker`>

### localy e2e tests run against firebase emulators
 - firebase cli setup is necessary
run `firebase emulators:exec "npm run test:e2e""` // or with dockerised db `test:e2e:docker`

# This app is
## using:
<h1 align="center">
  <a href="https://mikro-orm.io"><img src="https://raw.githubusercontent.com/mikro-orm/mikro-orm/master/docs/static/img/logo-readme.svg?sanitize=true" alt="MikroORM" /></a>
</h1>

TypeScript ORM for Node.js based on Data Mapper, [Unit of Work](https://mikro-orm.io/docs/unit-of-work/)
and [Identity Map](https://mikro-orm.io/docs/identity-map/) patterns. Supports MongoDB, MySQL,
MariaDB, PostgreSQL and SQLite databases.

> Heavily inspired by [Doctrine](https://www.doctrine-project.org/) and [Nextras Orm](https://nextras.org/orm/).

[![NPM version](https://img.shields.io/npm/v/@mikro-orm/core.svg)](https://www.npmjs.com/package/@mikro-orm/core)
[![NPM dev version](https://img.shields.io/npm/v/@mikro-orm/core/next.svg)](https://www.npmjs.com/package/@mikro-orm/core)
[![Chat on slack](https://img.shields.io/badge/chat-on%20slack-blue.svg)](https://join.slack.com/t/mikroorm/shared_invite/enQtNTM1ODYzMzM4MDk3LWM4ZDExMjU5ZDhmNjA2MmM3MWMwZmExNjhhNDdiYTMwNWM0MGY5ZTE3ZjkyZTMzOWExNDgyYmMzNDE1NDI5NjA)
[![Downloads](https://img.shields.io/npm/dm/@mikro-orm/core.svg)](https://www.npmjs.com/package/@mikro-orm/core)
[![Coverage Status](https://img.shields.io/coveralls/mikro-orm/mikro-orm.svg)](https://coveralls.io/r/mikro-orm/mikro-orm?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/27999651d3adc47cfa40/maintainability)](https://codeclimate.com/github/mikro-orm/mikro-orm/maintainability)
[![Build Status](https://github.com/mikro-orm/mikro-orm/workflows/tests/badge.svg?branch=master)](https://github.com/mikro-orm/mikro-orm/actions?workflow=tests)

## 🤔 Unit of What?

You might be asking: _What the hell is Unit of Work and why should I care about it?_

> Unit of Work maintains a list of objects (_entities_) affected by a business transaction
> and coordinates the writing out of changes. [(Martin Fowler)](https://www.martinfowler.com/eaaCatalog/unitOfWork.html)

> Identity Map ensures that each object (_entity_) gets loaded only once by keeping every
> loaded object in a map. Looks up objects using the map when referring to them.
> [(Martin Fowler)](https://www.martinfowler.com/eaaCatalog/identityMap.html)

So what benefits does it bring to us?

### Implicit Transactions

First and most important implication of having Unit of Work is that it allows handling
transactions automatically.

When you call `em.flush()`, all computed changes are queried inside a database
transaction (if supported by given driver). This means that you can control the boundaries
of transactions simply by calling `em.persistLater()` and once all your changes
are ready, calling `flush()` will run them inside a transaction.

## Authors

👤 **Martin Adámek**

- Twitter: [@B4nan](https://twitter.com/B4nan)
- Github: [@b4nan](https://github.com/b4nan)

See also the list of contributors who [participated](https://github.com/mikro-orm/mikro-orm/contributors) in this project.

## Show Your Support

Please ⭐️ this repository if this project helped you!

## 📝 License

Copyright © 2018 [Martin Adámek](https://github.com/b4nan).

This project is licensed under the MIT License - see the [LICENSE file](LICENSE) for details.

## using:

<div align="center"> <a href="https://fastify.io/">
    <img
      src="https://github.com/fastify/graphics/raw/HEAD/fastify-landscape-outlined.svg"
      width="650"
      height="auto"
    />
  </a>
</div>

<div align="center">

[![CI](https://github.com/fastify/fastify/workflows/ci/badge.svg)](https://github.com/fastify/fastify/actions/workflows/ci.yml)
[![Package Manager
CI](https://github.com/fastify/fastify/workflows/package-manager-ci/badge.svg)](https://github.com/fastify/fastify/actions/workflows/package-manager-ci.yml)
[![Web
SIte](https://github.com/fastify/fastify/workflows/website/badge.svg)](https://github.com/fastify/fastify/actions/workflows/website.yml)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://standardjs.com/)

</div>

<div align="center">

[![NPM
version](https://img.shields.io/npm/v/fastify.svg?style=flat)](https://www.npmjs.com/package/fastify)
[![NPM
downloads](https://img.shields.io/npm/dm/fastify.svg?style=flat)](https://www.npmjs.com/package/fastify)
[![Security Responsible
Disclosure](https://img.shields.io/badge/Security-Responsible%20Disclosure-yellow.svg)](https://github.com/fastify/fastify/blob/main/SECURITY.md)
[![Discord](https://img.shields.io/discord/725613461949906985)](https://discord.gg/fastify)

</div>

<br />

An efficient server implies a lower cost of the infrastructure, a better
responsiveness under load and happy users. How can you efficiently handle the
resources of your server, knowing that you are serving the highest number of
requests as possible, without sacrificing security validations and handy
development?

Enter Fastify. Fastify is a web framework highly focused on providing the best
developer experience with the least overhead and a powerful plugin architecture.
It is inspired by Hapi and Express and as far as we know, it is one of the
fastest web frameworks in town.


### Core features

- **Highly performant:** as far as we know, Fastify is one of the fastest web
  frameworks in town, depending on the code complexity we can serve up to 76+
  thousand requests per second.
- **Extendible:** Fastify is fully extensible via its hooks, plugins and
  decorators.
- **Schema based:** even if it is not mandatory we recommend to use [JSON
  Schema](https://json-schema.org/) to validate your routes and serialize your
  outputs, internally Fastify compiles the schema in a highly performant
  function.
- **Logging:** logs are extremely important but are costly; we chose the best
  logger to almost remove this cost, [Pino](https://github.com/pinojs/pino)!
- **Developer friendly:** the framework is built to be very expressive and help
  the developer in their daily use, without sacrificing performance and
  security.

### Benchmarks

__Machine:__ EX41S-SSD, Intel Core i7, 4Ghz, 64GB RAM, 4C/8T, SSD.

__Method:__: `autocannon -c 100 -d 40 -p 10 localhost:3000` * 2, taking the
second average

| Framework          | Version                    | Router?      |  Requests/sec |
| :----------------- | :------------------------- | :----------: | ------------: |
| Express            | 4.17.3                     | &#10003;     | 14,200        |
| hapi               | 20.2.1                     | &#10003;     | 42,284        |
| Restify            | 8.6.1                      | &#10003;     | 50,363        |
| Koa                | 2.13.0                     | &#10007;     | 54,272        |
| **Fastify**        | **4.0.0**                  | **&#10003;** | **77,193**    |
| -                  |                            |              |               |
| `http.Server`      | 16.14.2	                  | &#10007;     | 74,513        |

Benchmarks taken using https://github.com/fastify/benchmarks. This is a
synthetic, "hello world" benchmark that aims to evaluate the framework overhead.
The overhead that each framework has on your application depends on your
application, you should __always__ benchmark if performance matters to you.

## Documentation
* <a href="./docs/Guides/Getting-Started.md"><code><b>Getting
  Started</b></code></a>
* <a href="./docs/Guides/Index.md"><code><b>Guides</b></code></a>
* <a href="./docs/Reference/Server.md"><code><b>Server</b></code></a>
* <a href="./docs/Reference/Routes.md"><code><b>Routes</b></code></a>
* <a
  href="./docs/Reference/Encapsulation.md"><code><b>Encapsulation</b></code></a>
* <a href="./docs/Reference/Logging.md"><code><b>Logging</b></code></a>
* <a href="./docs/Reference/Middleware.md"><code><b>Middleware</b></code></a>
* <a href="./docs/Reference/Hooks.md"><code><b>Hooks</b></code></a>
* <a href="./docs/Reference/Decorators.md"><code><b>Decorators</b></code></a>
* <a href="./docs/Reference/Validation-and-Serialization.md"><code><b>Validation
  and Serialization</b></code></a>
* <a href="./docs/Guides/Fluent-Schema.md"><code><b>Fluent Schema</b></code></a>
* <a href="./docs/Reference/Lifecycle.md"><code><b>Lifecycle</b></code></a>
* <a href="./docs/Reference/Reply.md"><code><b>Reply</b></code></a>
* <a href="./docs/Reference/Request.md"><code><b>Request</b></code></a>
* <a href="./docs/Reference/Errors.md"><code><b>Errors</b></code></a>
* <a href="./docs/Reference/ContentTypeParser.md"><code><b>Content Type
  Parser</b></code></a>
* <a href="./docs/Reference/Plugins.md"><code><b>Plugins</b></code></a>
* <a href="./docs/Guides/Testing.md"><code><b>Testing</b></code></a>
* <a href="./docs/Guides/Benchmarking.md"><code><b>Benchmarking</b></code></a>
* <a href="./docs/Guides/Write-Plugin.md"><code><b>How to write a good
  plugin</b></code></a>
* <a href="./docs/Guides/Plugins-Guide.md"><code><b>Plugins Guide</b></code></a>
* <a href="./docs/Reference/HTTP2.md"><code><b>HTTP2</b></code></a>
* <a href="./docs/Reference/LTS.md"><code><b>Long Term Support</b></code></a>
* <a href="./docs/Reference/TypeScript.md"><code><b>TypeScript and types
  support</b></code></a>
* <a href="./docs/Guides/Serverless.md"><code><b>Serverless</b></code></a>
* <a
  href="./docs/Guides/Recommendations.md"><code><b>Recommendations</b></code></a>


## Ecosystem

- [Core](./docs/Guides/Ecosystem.md#core) - Core plugins maintained by the
  _Fastify_ [team](#team).
- [Community](./docs/Guides/Ecosystem.md#community) - Community supported
  plugins.
- [Live Examples](https://github.com/fastify/example) - Multirepo with a broad
  set of real working examples.
- [Discord](https://discord.gg/D3FZYPy) - Join our discord server and chat with
  the maintainers.

## using:

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## License

Nest is [MIT licensed](LICENSE).
