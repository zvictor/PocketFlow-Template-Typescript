import { BaseNode, DEFAULT_ACTION } from 'pocketflowframework'

import type { ISharedState } from '~/flows/qa'

export default class GetQuestionNode extends BaseNode {
  public _clone(): BaseNode {
    return new GetQuestionNode()
  }

  async prep(sharedState: ISharedState): Promise<ISharedState['question']> {
    return sharedState.question
  }

  async execCore(question: string): Promise<string> {
    return question
  }

  async post(
    prepResult: Awaited<ReturnType<typeof this.prep>>,
    execResult: string,
    sharedState: ISharedState,
  ): Promise<string> {
    sharedState.question = execResult
    return DEFAULT_ACTION
  }
}
