import fs from 'node:fs'
import OpenAI from 'openai'
import { temporaryFile } from 'tempy'
import { assert } from '@std/assert'
import { logger } from '@trigger.dev/sdk/v3'
import { flattenObject } from '~/utils/utils'

import type { RequestOptions } from 'openai/core.mjs'
import type {
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionMessage,
} from 'openai/resources/chat/completions'

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
})

export const chat = async (
  body: ChatCompletionCreateParamsNonStreaming,
  {
    saveRequest = false,
    saveResponse = false,
    ...options
  }: RequestOptions<unknown> & {
    saveRequest?: boolean
    saveResponse?: boolean
  } = {},
): Promise<ChatCompletionMessage> => {
  return await logger.trace('LLM call', async (span) => {
    // span.addEvent('Request Body', flattenObject(body))
    if (saveRequest) {
      logger.trace('Store request', async (childSpan) => {
        const location = temporaryFile({ name: `request.json` })
        fs.writeFileSync(location, JSON.stringify(body, null, 2))
        logger.log(location)
      })
    }

    const response = await openai.chat.completions.create(body, options)
    // span.addEvent('Response', flattenObject(response))
    if (saveResponse) {
      logger.trace('Store response', async (childSpan) => {
        const location = temporaryFile({
          name: `${response._request_id || 'response'}.json`,
        })
        fs.writeFileSync(location, JSON.stringify(response, null, 2))
        logger.log(location)
      })
    }

    if (response.error) {
      const error = new Error(response.error.message)
      // span.addEvent('error', flattenObject(response.error))
      throw error
    }

    assert(response.choices.length === 1, 'Expected exactly one message in response')
    const message: ChatCompletionMessage = response.choices[0].message

    // span.addEvent(
    //   'Reply',
    //   flattenObject(
    //     body.response_format?.type === 'json_schema'
    //       ? (JSON.parse(message.content || '') as object)
    //       : message,
    //   ),
    // )

    return message
  })
}

export default openai
