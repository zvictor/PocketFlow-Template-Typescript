import { BaseNode, DEFAULT_ACTION } from 'pocketflowframework'
import { chat } from '~/utils/llm'

import type { ISharedState } from '~/flows/qa'

export default class AnswerNode extends BaseNode {
  public _clone(): BaseNode {
    return new AnswerNode()
  }

  async prep(sharedState: ISharedState): Promise<string> {
    if (!sharedState.question) {
      throw new Error('No question in shared state')
    }
    return sharedState.question
  }

  async execCore(question: string): Promise<string | null> {
    return (
      await chat({
        // model: 'qwen/qwq-32b',
        model: 'deepseek/deepseek-chat:free',
        messages: [
          {
            role: 'user',
            content: question,
          },
        ],
      })
    ).content
  }

  async post(
    prepResult: Awaited<ReturnType<typeof this.prep>>,
    execResult: string,
    sharedState: ISharedState,
  ): Promise<string> {
    sharedState.answer = execResult
    return DEFAULT_ACTION
  }
}
