import { WebClient } from '@slack/web-api'
import { Log } from '@/lib/utils/log'

if (!process.env.SLACK_BOT_TOKEN) {
  throw new Error('SLACK_BOT_TOKEN is not defined')
}

if (!process.env.SLACK_CHANNEL_ID) {
  throw new Error('SLACK_CHANNEL_ID is not defined')
}

export class SlackService {
  private static instance: WebClient | null = null

  private static getInstance(): WebClient {
    if (!this.instance) {
      this.instance = new WebClient(process.env.SLACK_BOT_TOKEN)
    }
    return this.instance
  }

  static async sendMessage(message: string) {
    try {
      await this.getInstance().chat.postMessage({
        channel: process.env.SLACK_CHANNEL_ID!,
        text: message,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: message,
            },
          },
        ],
      })
    } catch (error) {
      Log.error('Error sending Slack message', { error })
      throw error
    }
  }

  static async sendCronJobNotification(
    jobName: string,
    status: 'success' | 'error',
    details?: string,
  ) {
    const environment = process.env.NODE_ENV || 'development'
    const emoji = status === 'success' ? '✅' : '❌'
    const message = `**${environment.toUpperCase()}**\n${emoji} *Cron Job: ${jobName}*\nStatus: ${status}\n${
      details ? `Details: ${details}` : ''
    }`

    await this.sendMessage(message)
  }
}
