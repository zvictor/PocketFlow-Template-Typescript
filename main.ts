import { fileURLToPath } from 'node:url'
import { createQaFlow } from './flow'

async function main() {
  const shared = {
    question: "In one sentence, what's the end of universe?",
    answer: undefined as string | undefined,
  }

  const qaFlow = createQaFlow()
  const action = await qaFlow.run(shared)
  console.log('Question:', shared.question)
  console.log('Answer:', shared.answer)
  console.log('Action:', action)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main()
}
