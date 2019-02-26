const { enableAutoUpdate, disableAutoUpdate } = require('../autoUpdate')

const table = 'admin_users'

exports.up = (knex) => knex.raw(`
  CREATE TABLE IF NOT EXISTS ${table} (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL CHECK (LENGTH(username) > 2),
    password TEXT NOT NULL,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW()
  );

  ${enableAutoUpdate(table)}

  ALTER TABLE sites
    ADD COLUMN admin_user_id integer NOT NULL REFERENCES ${table}(id) ON DELETE CASCADE,
    ADD COLUMN verified boolean NOT NULL DEFAULT false;
`)

exports.down = (knex) => knex.raw(`
  ${disableAutoUpdate(table)}

  ALTER TABLE sites
    DROP COLUMN IF EXISTS admin_user_id,
    DROP COLUMN IF EXISTS verified;

  DROP TABLE IF EXISTS ${admin_users};
`)