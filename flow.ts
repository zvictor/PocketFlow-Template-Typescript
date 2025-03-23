import { Flow } from "pocketflowframework";
import { GetQuestionNode, AnswerNode } from './nodes';

export function createQaFlow(): Flow {
    // Create nodes
    const getQuestionNode = new GetQuestionNode();
    const answerNode = new AnswerNode();

    // Connect nodes in sequence
    getQuestionNode.addSuccessor(answerNode, "default");

    // Create flow starting with input node
    return new Flow(getQuestionNode);
}
