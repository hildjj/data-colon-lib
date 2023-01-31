import test from 'ava'
import fs from 'fs/promises'
import {parse} from '../lib/grammar.js'
import url from 'url'
import path from 'path'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('examples', async t => {
  const examples = await fs.readFile(path.join(__dirname, 'examples.txt'), 'utf8')
  for (const ex of examples.split('\n')) {
    if (ex) {
      try {
        const d = parse(ex, { grammarSource: 'ex' })
      } catch (e) {
        t.fail(e.format([{ source: 'ex', text: ex }]))
      }
    }
  }
  t.pass()
})

test('bad', async t => {
  const bad = await fs.readFile(path.join(__dirname, 'bad.txt'), 'utf8')
  for (const ex of bad.split('\n')) {
    if (ex.startsWith('data:')) {
      t.throws(() => parse(ex))
    }
  }
})
