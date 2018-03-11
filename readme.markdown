pg-context

# description
Create a postgres database in a context, when the context is disposed, the
database is destroyed. This is ideal for testing purposes, you can easily
create (and initialize!) a database when the test starts, and destroy the
database when the test has finished.

# usage
Using it with vanilla javascript.

```javascript
import { PgContext } from "pg-context";

// prepare a script that will initialize the database
const sql = `
CREATE TABLE t (
    id serial primary key
);
INSERT INTO t DEFAULT VALUES;
`;

// create a context that will create a database for us.
const ctx = await PgContext.create(sql);
try {
    // the pool property of the context hold a pool for the created database
    const { pool } = ctx;
    const result = await pool.query(`SELECT * FROM t;`);
    
    // do some assertion or whatever tickles your fancy
    assert.equal(result.rowCount, 1);
}
finally {
    // cleanup the database that we created earlier
    await ctx.dispose();
}
```

You could simplfy this by using the `using-disposable` library.
```javascript
import { using } from "using-disposable";
import { PgContext } from "pg-context";

// prepare a script that will initialize the database
const sql = `
CREATE TABLE t (
    id serial primary key
);
INSERT INTO t DEFAULT VALUES;
`;

// the using function will create and dispose then context for us 
using(PgContext.create(sql), async ctx => {
    // the pool property of the context hold a pool for the created database
    const {pool} = ctx;
    const result = await pool.query(`SELECT * FROM t;`);
    
    // do some assertion or whatever tickles your fancy
    assert.equal(result.rowCount, 1);
})
```

TODO: add mocha example

# running the tests
To run the unit tests you will need a running postgresql databas server and you
will need to provide connection details to the test. Run the test like this:
```bash
PGHOST=pg.host.com PGDATABASE=postgres PGUSER=postgres PGPASSWORD=supersecret npm test
```

# pre-commit hook
NEVER commit something that breaks the build! If you do, you suck. You can
easily prevent this by linking the `test.sh` script as a git `pre-push` or
`pre-commit` hook!

like this:
```bash
ln test.sh .git/hooks/pre-commit
```

If you use a git commit hook for testing, you may also bypass this hook with
the `--no-verify` or `-n` option of git commit, like this:
```bash
git commit -nm'some commit message'
```
