import { unlink } from 'fs/promises'
import { join } from 'path'
import { getConnection } from 'typeorm'

global.beforeEach(async () => {
  try {
    await unlink(join(__dirname, '..', 'test.sqlite'))
  } catch (err) {}
})


global.afterEach(async () => {
  const conn = getConnection();
  await conn.close()
})