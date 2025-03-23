import { fileURLToPath } from 'node:url'
import { qaFlow } from './flows'

async function main() {
  const shared = {
    question: "In one sentence, what's the meaning of life?",
    answer: undefined as string | undefined,
  }

  const action = await qaFlow().run(shared)
  console.log('Question:', shared.question)
  console.log('Answer:', shared.answer)
  console.log('Action:', action)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main()
}
