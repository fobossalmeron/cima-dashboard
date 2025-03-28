import { useEffect, useState } from 'react'
import Pusher from 'pusher-js'

export function usePusher() {
  const [pusher, setPusher] = useState<Pusher | null>(null)

  useEffect(() => {
    if (!pusher) {
      const newPusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      })
      setPusher(newPusher)
    }

    return () => {
      if (pusher) {
        pusher.disconnect()
      }
    }
  }, [pusher])

  return { pusher }
}
