import test from 'ava'
import fs from 'fs/promises'
import {dataURL, SOURCE} from '../lib/index.js'
import url from 'url'
import path from 'path'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('examples', async t => {
  const examples = await fs.readFile(path.join(__dirname, 'examples.txt'), 'utf8')
  for (const ex of examples.split('\n')) {
    if (ex) {
      t.truthy(dataURL(ex), ex)
    }
  }
})


test('error', t => {
  const inp = 'data:'
  try {
    dataURL(inp)
  } catch (ex) {
    t.snapshot(ex.format([{source: SOURCE, text: inp}]))
  }
})
