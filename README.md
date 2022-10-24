## TODO:
-  more tests
-  more error handling
- CI/CD
- dockerize all the things
- - [x] db
- - [x] app
- - firebaseEmulators
- compose them
- - fix failing docker-compose due OpenApi error
- - more swagger

### to run the app localy
`npm install && npm run start`
or
`start:dev`
or
`start:debug`
- local postgres is expected

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

> You can also control the transaction boundaries manually via `em.transactional(cb)`.

```typescript
const user = await em.findOneOrFail(User, 1);
user.email = 'foo@bar.com';
const car = new Car();
user.cars.add(car);

// thanks to bi-directional cascading we only need to persist user entity
// flushing will create a transaction, insert new car and update user with new email
// as user entity is managed, calling flush() is enough
await em.flush();
```

### ChangeSet based persistence

MikroORM allows you to implement your domain/business logic directly in the entities.
To maintain always valid entities, you can use constructors to mark required properties.
Let's define the `User` entity used in previous example:

```typescript
@Entity()
export class User {

  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @OneToOne()
  address?: Address;

  @ManyToMany()
  cars = new Collection<Car>(this);

  constructor(name: string) {
    this.name = name;
  }

}
```

Now to create new instance of the `User` entity, we are forced to provide the `name`:

```typescript
const user = new User('John Doe'); // name is required to create new user instance
user.address = new Address('10 Downing Street'); // address is optional
```

Once your entities are loaded, make a number of synchronous actions on your entities,
then call `em.flush()`. This will trigger computing of change sets. Only entities
(and properties) that were changed will generate database queries, if there are no changes,
no transaction will be started.

```typescript
const user = await em.findOneOrFail(User, 1, ['cars', 'address']);
user.title = 'Mr.';
user.address.street = '10 Downing Street'; // address is 1:1 relation of Address entity
user.cars.getItems().forEach(car => car.forSale = true); // cars is 1:m collection of Car entities
const car = new Car('VW');
user.cars.add(car);

// now we can flush all changes done to managed entities
await em.flush();
```

`em.flush()` will then execute these queries from the example above:

```sql
begin;
update user set title = 'Mr.' where id = 1;
update user_address set street = '10 Downing Street' where id = 123;
update car set for_sale = true where id = 1;
update car set for_sale = true where id = 2;
update car set for_sale = true where id = 3;
insert into car (brand, owner) values ('VW', 1);
commit;
```

### Only One Instance of Entity

Thanks to Identity Map, you will always have only one instance of given entity in one context.
This allows for some optimizations (skipping loading of already loaded entities), as well as
comparison by identity (`ent1 === ent2`).

## 📖 Documentation

MikroORM v4 documentation, included in this repo in the root directory, is built with
[Jekyll](https://jekyllrb.com/) and publicly hosted on GitHub Pages at https://mikro-orm.io.

There is also auto-generated [CHANGELOG.md](CHANGELOG.md) file based on commit messages
(via `semantic-release`).

> You can browse MikroORM v3 docs at [https://mikro-orm.io/docs/3.6/installation](https://mikro-orm.io/docs/3.6/installation).

> To upgrade to v4, please see the [upgrading guide](https://mikro-orm.io/docs/upgrading-v3-to-v4).

## ✨ Core Features

- [Clean and Simple Entity Definition](https://mikro-orm.io/docs/defining-entities/)
- [Identity Map](https://mikro-orm.io/docs/identity-map/)
- [Entity References](https://mikro-orm.io/docs/entity-references/)
- [Using Entity Constructors](https://mikro-orm.io/docs/using-entity-constructors/)
- [Modelling Relationships](https://mikro-orm.io/docs/relationships/)
- [Collections](https://mikro-orm.io/docs/collections/)
- [Unit of Work](https://mikro-orm.io/docs/unit-of-work/)
- [Transactions](https://mikro-orm.io/docs/transactions/)
- [Cascading persist and remove](https://mikro-orm.io/docs/cascading/)
- [Composite and Foreign Keys as Primary Key](https://mikro-orm.io/docs/composite-keys/)
- [Filters](https://mikro-orm.io/docs/filters/)
- [Using `QueryBuilder`](https://mikro-orm.io/docs/query-builder/)
- [Preloading Deeply Nested Structures via populate](https://mikro-orm.io/docs/nested-populate/)
- [Property Validation](https://mikro-orm.io/docs/property-validation/)
- [Lifecycle Hooks](https://mikro-orm.io/docs/lifecycle-hooks/)
- [Vanilla JS Support](https://mikro-orm.io/docs/usage-with-js/)
- [Schema Generator](https://mikro-orm.io/docs/schema-generator/)
- [Entity Generator](https://mikro-orm.io/docs/entity-generator/)

## 📦 Example Integrations

You can find example integrations for some popular frameworks in the [`mikro-orm-examples` repository](https://github.com/mikro-orm/mikro-orm-examples):

### TypeScript Examples

- [Express + MongoDB](https://github.com/mikro-orm/express-ts-example-app)
- [Nest + MySQL](https://github.com/mikro-orm/nestjs-example-app)
- [RealWorld example app (Nest + MySQL)](https://github.com/mikro-orm/nestjs-realworld-example-app)
- [Koa + SQLite](https://github.com/mikro-orm/koa-ts-example-app)
- [GraphQL + PostgreSQL](https://github.com/driescroons/mikro-orm-graphql-example)
- [Inversify + PostgreSQL](https://github.com/PodaruDragos/inversify-example-app)
- [NextJS + MySQL](https://github.com/jonahallibone/mikro-orm-nextjs)

### JavaScript Examples
- [Express + MongoDB](https://github.com/mikro-orm/express-js-example-app)

## Articles

- Introducing MikroORM, TypeScript data-mapper ORM with Identity Map
    - on [medium.com](https://medium.com/dailyjs/introducing-mikro-orm-typescript-data-mapper-orm-with-identity-map-9ba58d049e02)
    - on [dev.to](https://dev.to/b4nan/introducing-mikroorm-typescript-data-mapper-orm-with-identity-map-pc8)
- Handling transactions and concurrency in MikroORM
    - on [medium.com](https://medium.com/dailyjs/handling-transactions-and-concurrency-in-mikro-orm-ba80d0a65805)
    - on [dev.to](https://dev.to/b4nan/handling-transactions-and-concurrency-in-mikroorm-2cfj)
- MikroORM 3: Knex.js, CLI, Schema Updates, Entity Generator and more…
    - on [medium.com](https://medium.com/dailyjs/mikro-orm-3-knex-js-cli-schema-updates-entity-generator-and-more-e51ecbbc508c)
    - on [dev.to](https://dev.to/b4nan/mikroorm-3-knex-js-cli-schema-updates-entity-generator-and-more-3g56)

## 🚀 Quick Start

First install the module via `yarn` or `npm` and do not forget to install the database driver as well:

> Since v4, you should install the driver package, but not the db connector itself,
> e.g. install `@mikro-orm/sqlite`, but not `sqlite3` as that is already included
> in the driver package.

```sh
yarn add @mikro-orm/core @mikro-orm/mongodb     # for mongo
yarn add @mikro-orm/core @mikro-orm/mysql       # for mysql/mariadb
yarn add @mikro-orm/core @mikro-orm/mariadb     # for mysql/mariadb
yarn add @mikro-orm/core @mikro-orm/postgresql  # for postgresql
yarn add @mikro-orm/core @mikro-orm/sqlite      # for sqlite
```

or

```sh
npm i -s @mikro-orm/core @mikro-orm/mongodb     # for mongo
npm i -s @mikro-orm/core @mikro-orm/mysql       # for mysql/mariadb
npm i -s @mikro-orm/core @mikro-orm/mariadb     # for mysql/mariadb
npm i -s @mikro-orm/core @mikro-orm/postgresql  # for postgresql
npm i -s @mikro-orm/core @mikro-orm/sqlite      # for sqlite
```

Next you will need to enable support for [decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)
as well as `esModuleInterop` in `tsconfig.json` via:

```json
"experimentalDecorators": true,
"emitDecoratorMetadata": true,
"esModuleInterop": true,
```

Then call `MikroORM.init` as part of bootstrapping your app:

> To access driver specific methods like `em.createQueryBuilder()` we need to specify
> the driver type when calling `MikroORM.init()`. Alternatively we can cast the
> `orm.em` to `EntityManager` exported from the driver package:
>
> ```ts
> import { EntityManager } from '@mikro-orm/postgresql';
> const em = orm.em as EntityManager;
> const qb = em.createQueryBuilder(...);
> ```

```typescript
import type { PostgreSqlDriver } from '@mikro-orm/postgresql'; // or any other SQL driver package

const orm = await MikroORM.init<PostgreSqlDriver>({
  entities: ['./dist/entities'], // path to your JS entities (dist), relative to `baseDir`
  dbName: 'my-db-name',
  type: 'postgresql',
});
console.log(orm.em); // access EntityManager via `em` property
```

There are more ways to configure your entities, take a look at
[installation page](https://mikro-orm.io/docs/installation/).

> Read more about all the possible configuration options in [Advanced Configuration](https://mikro-orm.io/docs/configuration) section.

Then you will need to fork entity manager for each request so their
[identity maps](https://mikro-orm.io/docs/identity-map/) will not collide.
To do so, use the `RequestContext` helper:

```typescript
const app = express();

app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});
```

> You should register this middleware as the last one just before request handlers and before
> any of your custom middleware that is using the ORM. There might be issues when you register
> it before request processing middleware like `queryParser` or `bodyParser`, so definitely
> register the context after them.

More info about `RequestContext` is described [here](https://mikro-orm.io/docs/identity-map/#request-context).

Now you can start defining your entities (in one of the `entities` folders). This is how
simple entity can look like in mongo driver:

**`./entities/MongoBook.ts`**

```typescript
@Entity()
export class MongoBook {

  @PrimaryKey()
  _id: ObjectID;

  @SerializedPrimaryKey()
  id: string;

  @Property()
  title: string;

  @ManyToOne()
  author: Author;

  @ManyToMany()
  tags = new Collection<BookTag>(this);

  constructor(title: string, author: Author) {
    this.title = title;
    this.author = author;
  }

}
```

For SQL drivers, you can use `id: number` PK:

**`./entities/SqlBook.ts`**

```typescript
@Entity()
export class SqlBook {

  @PrimaryKey()
  id: number;

}
```

Or if you want to use UUID primary keys:

**`./entities/UuidBook.ts`**

```typescript
import { v4 } from 'uuid';

@Entity()
export class UuidBook {

  @PrimaryKey()
  uuid = v4();

}
```

More information can be found in
[defining entities section](https://mikro-orm.io/docs/defining-entities/) in docs.

When you have your entities defined, you can start using ORM either via `EntityManager`
or via `EntityRepository`s.

To save entity state to database, you need to persist it. Persist takes care or deciding
whether to use `insert` or `update` and computes appropriate change-set. Entity references
that are not persisted yet (does not have identifier) will be cascade persisted automatically.

```typescript
// use constructors in your entities for required parameters
const author = new Author('Jon Snow', 'snow@wall.st');
author.born = new Date();

const publisher = new Publisher('7K publisher');

const book1 = new Book('My Life on The Wall, part 1', author);
book1.publisher = publisher;
const book2 = new Book('My Life on The Wall, part 2', author);
book2.publisher = publisher;
const book3 = new Book('My Life on The Wall, part 3', author);
book3.publisher = publisher;

// just persist books, author and publisher will be automatically cascade persisted
await orm.em.persistAndFlush([book1, book2, book3]);
```

To fetch entities from database you can use `find()` and `findOne()` of `EntityManager`:

```typescript
const authors = orm.em.find(Author, {});

for (const author of authors) {
  console.log(author); // instance of Author entity
  console.log(author.name); // Jon Snow

  for (const book of author.books) { // iterating books collection
    console.log(book); // instance of Book entity
    console.log(book.title); // My Life on The Wall, part 1/2/3
  }
}
```

More convenient way of fetching entities from database is by using `EntityRepository`, that
carries the entity name so you do not have to pass it to every `find` and `findOne` calls:

```typescript
const booksRepository = orm.em.getRepository(Book);

// with sorting, limit and offset parameters, populating author references
const books = await booksRepository.find({ author: '...' }, ['author'], { title: QueryOrder.DESC }, 2, 1);

// or with options object
const books = await booksRepository.find({ author: '...' }, { 
  populate: ['author'],
  limit: 1,
  offset: 2,
  orderBy: { title: QueryOrder.DESC },
});

console.log(books); // Book[]
```

Take a look at docs about [working with `EntityManager`](https://mikro-orm.io/docs/entity-manager/)
or [using `EntityRepository` instead](https://mikro-orm.io/docs/repositories/).

## 🤝 Contributing

Contributions, issues and feature requests are welcome. Please read
[CONTRIBUTING.md](CONTRIBUTING.md)
for details on the process for submitting pull requests to us.

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

- [Quick start](#quick-start)
- [Install](#install)
- [Example](#example)
- [Fastify v1.x and v2.x](#fastify-v1x-and-v2x)
- [Core features](#core-features)
- [Benchmarks](#benchmarks)
- [Documentation](#documentation)
- [Ecosystem](#ecosystem)
- [Support](#support)
- [Team](#team)
- [Hosted by](#hosted-by)
- [License](#license)

Enter Fastify. Fastify is a web framework highly focused on providing the best
developer experience with the least overhead and a powerful plugin architecture.
It is inspired by Hapi and Express and as far as we know, it is one of the
fastest web frameworks in town.

This branch refers to the Fastify v4 release. Check out the
[v3.x](https://github.com/fastify/fastify/tree/v3.x) branch for v3.

### Quick start

Create a folder and make it your current working directory:

```sh
mkdir my-app
cd my-app
```

Generate a fastify project with `npm init`:

```sh
npm init fastify
```

Install dependencies:

```sh
npm i
```

To start the app in dev mode:

```sh
npm run dev
```

For production mode:

```sh
npm start
```

Under the hood `npm init` downloads and runs [Fastify
Create](https://github.com/fastify/create-fastify), which in turn uses the
generate functionality of [Fastify CLI](https://github.com/fastify/fastify-cli).


### Install

To install Fastify in an existing project as a dependency:

Install with npm:
```sh
npm i fastify
```
Install with yarn:
```sh
yarn add fastify
```

### Example

```js
// Require the framework and instantiate it

// ESM
import Fastify from 'fastify'
const fastify = Fastify({
  logger: true
})
// CommonJs
const fastify = require('fastify')({
  logger: true
})

// Declare a route
fastify.get('/', (request, reply) => {
  reply.send({ hello: 'world' })
})

// Run the server!
fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err
  // Server is now listening on ${address}
})
```

with async-await:

```js
// ESM
import Fastify from 'fastify'
const fastify = Fastify({
  logger: true
})
// CommonJs
const fastify = require('fastify')({
  logger: true
})

fastify.get('/', async (request, reply) => {
  reply.type('application/json').code(200)
  return { hello: 'world' }
})

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err
  // Server is now listening on ${address}
})
```

Do you want to know more? Head to the <a
href="./docs/Guides/Getting-Started.md"><code><b>Getting Started</b></code></a>.


### Fastify v1.x and v2.x

Code for Fastify's **v1.x** is in [**`branch
1.x`**](https://github.com/fastify/fastify/tree/1.x), so all Fastify 1.x related
changes should be based on **`branch 1.x`**. In a similar way, all Fastify
**v2.x** related changes should be based on [**`branch
2.x`**](https://github.com/fastify/fastify/tree/2.x).

> ## Note
> `.listen` binds to the local host, `localhost`, interface by default
> (`127.0.0.1` or `::1`, depending on the operating system configuration). If
> you are running Fastify in a container (Docker,
> [GCP](https://cloud.google.com/), etc.), you may need to bind to `0.0.0.0`. Be
> careful when deciding to listen on all interfaces; it comes with inherent
> [security
> risks](https://web.archive.org/web/20170711105010/https://snyk.io/blog/mongodb-hack-and-secure-defaults/).
> See [the documentation](./docs/Reference/Server.md#listen) for more
> information.

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

## Support
Please visit [Fastify help](https://github.com/fastify/help) to view prior
support issues and to ask new support questions.

## Team

_Fastify_ is the result of the work of a great community. Team members are
listed in alphabetical order.

**Lead Maintainers:**
* [__Matteo Collina__](https://github.com/mcollina),
  <https://twitter.com/matteocollina>, <https://www.npmjs.com/~matteo.collina>
* [__Tomas Della Vedova__](https://github.com/delvedor),
  <https://twitter.com/delvedor>, <https://www.npmjs.com/~delvedor>

### Fastify Core team
* [__Tommaso Allevi__](https://github.com/allevo),
  <https://twitter.com/allevitommaso>, <https://www.npmjs.com/~allevo>
* [__Ethan Arrowood__](https://github.com/Ethan-Arrowood/),
  <https://twitter.com/arrowoodtech>, <https://www.npmjs.com/~ethan_arrowood>
* [__Harry Brundage__](https://github.com/airhorns/),
  <https://twitter.com/harrybrundage>, <https://www.npmjs.com/~airhorns>
* [__David Mark Clements__](https://github.com/davidmarkclements),
  <https://twitter.com/davidmarkclem>,
  <https://www.npmjs.com/~davidmarkclements>
* [__Matteo Collina__](https://github.com/mcollina),
  <https://twitter.com/matteocollina>, <https://www.npmjs.com/~matteo.collina>
* [__Tomas Della Vedova__](https://github.com/delvedor),
  <https://twitter.com/delvedor>, <https://www.npmjs.com/~delvedor>
* [__Dustin Deus__](https://github.com/StarpTech),
  <https://twitter.com/dustindeus>, <https://www.npmjs.com/~starptech>
* [__Ayoub El Khattabi__](https://github.com/AyoubElk),
  <https://twitter.com/ayoubelkh>, <https://www.npmjs.com/~ayoubelk>
* [__Denis Fäcke__](https://github.com/SerayaEryn),
  <https://twitter.com/serayaeryn>, <https://www.npmjs.com/~serayaeryn>
* [__Rafael Gonzaga__](https://github.com/rafaelgss),
  <https://twitter.com/_rafaelgss>, <https://www.npmjs.com/~rafaelgss>
* [__Vincent Le Goff__](https://github.com/zekth)
* [__Luciano Mammino__](https://github.com/lmammino),
  <https://twitter.com/loige>, <https://www.npmjs.com/~lmammino>
* [__Luis Orbaiceta__](https://github.com/luisorbaiceta),
  <https://twitter.com/luisorbai>, <https://www.npmjs.com/~luisorbaiceta>
* [__Maksim Sinik__](https://github.com/fox1t),
  <https://twitter.com/maksimsinik>, <https://www.npmjs.com/~fox1t>
* [__Manuel Spigolon__](https://github.com/eomm),
  <https://twitter.com/manueomm>, <https://www.npmjs.com/~eomm>
* [__James Sumners__](https://github.com/jsumners),
  <https://twitter.com/jsumners79>, <https://www.npmjs.com/~jsumners>

### Fastify Plugins team
* [__Matteo Collina__](https://github.com/mcollina),
  <https://twitter.com/matteocollina>, <https://www.npmjs.com/~matteo.collina>
* [__Harry Brundage__](https://github.com/airhorns/),
  <https://twitter.com/harrybrundage>, <https://www.npmjs.com/~airhorns>
* [__Tomas Della Vedova__](https://github.com/delvedor),
  <https://twitter.com/delvedor>, <https://www.npmjs.com/~delvedor>
* [__Ayoub El Khattabi__](https://github.com/AyoubElk),
  <https://twitter.com/ayoubelkh>, <https://www.npmjs.com/~ayoubelk>
* [__Vincent Le Goff__](https://github.com/zekth)
* [__Salman Mitha__](https://github.com/salmanm),
  <https://www.npmjs.com/~salmanm>
* [__Maksim Sinik__](https://github.com/fox1t),
  <https://twitter.com/maksimsinik>, <https://www.npmjs.com/~fox1t>
* [__Frazer Smith__](https://github.com/Fdawgs), <https://www.npmjs.com/~fdawgs>
* [__Manuel Spigolon__](https://github.com/eomm),
  <https://twitter.com/manueomm>, <https://www.npmjs.com/~eomm>
* [__Rafael Gonzaga__](https://github.com/rafaelgss),
  <https://twitter.com/_rafaelgss>, <https://www.npmjs.com/~rafaelgss>

### Great Contributors
Great contributors on a specific area in the Fastify ecosystem will be invited
to join this group by Lead Maintainers.

* [__dalisoft__](https://github.com/dalisoft), <https://twitter.com/dalisoft>,
  <https://www.npmjs.com/~dalisoft>
* [__Luciano Mammino__](https://github.com/lmammino),
  <https://twitter.com/loige>, <https://www.npmjs.com/~lmammino>
* [__Evan Shortiss__](https://github.com/evanshortiss),
  <https://twitter.com/evanshortiss>, <https://www.npmjs.com/~evanshortiss>

**Past Collaborators**
* [__Çağatay Çalı__](https://github.com/cagataycali),
  <https://twitter.com/cagataycali>, <https://www.npmjs.com/~cagataycali>
* [__Trivikram Kamat__](https://github.com/trivikr),
  <https://twitter.com/trivikram>, <https://www.npmjs.com/~trivikr>
* [__Cemre Mengu__](https://github.com/cemremengu),
  <https://twitter.com/cemremengu>, <https://www.npmjs.com/~cemremengu>
* [__Nathan Woltman__](https://github.com/nwoltman),
  <https://twitter.com/NathanWoltman>, <https://www.npmjs.com/~nwoltman>

## Hosted by

[<img
src="https://github.com/openjs-foundation/artwork/blob/main/openjs_foundation/openjs_foundation-logo-horizontal-color.png?raw=true"
width="250px;"/>](https://openjsf.org/projects/#growth)

We are a [Growth
Project](https://github.com/openjs-foundation/cross-project-council/blob/HEAD/PROJECT_PROGRESSION.md#growth-stage)
in the [OpenJS Foundation](https://openjsf.org/).

## Acknowledgements

This project is kindly sponsored by:
- [nearForm](https://nearform.com)

Past Sponsors:
- [LetzDoIt](https://www.letzdoitapp.com/)

## License

Licensed under [MIT](./LICENSE).

For your convenience, here is a list of all the licenses of our production
dependencies:
- MIT
- ISC
- BSD-3-Clause
- BSD-2-Clause

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

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
