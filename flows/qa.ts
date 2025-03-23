import { Flow } from 'pocketflowframework'
import AnswerNode from '~/nodes/answer-question'
import GetQuestionNode from '~/nodes/get-question'

export interface ISharedState {
  question?: string
  answer?: string
}

export default function (): Flow {
  // Create nodes
  const getQuestionNode = new GetQuestionNode()
  const answerNode = new AnswerNode()

  // Connect nodes in sequence
  getQuestionNode.addSuccessor(answerNode, 'default')

  // Create flow starting with input node
  return new Flow(getQuestionNode)
}
