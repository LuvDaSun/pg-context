import * as test from "blue-tape";
import { using } from "dispose";
import { PgContext } from "./pg-context";

const sql = `
CREATE TABLE public.one(
    id SERIAL,
    name TEXT NOT NULL
);
`;

test(
    "PgContext#create",
    async t => using(PgContext.create(sql), async ({ pool }) => {
        const result = await pool.query(`
INSERT INTO public.one (name)
VALUES('one')
RETURNING *
;`);
        t.equal(result.rowCount, 1);

        const [row] = result.rows;
        t.deepEqual(row, { id: 1, name: "one" });
    }),
);
