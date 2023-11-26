import type { WriteStream } from 'node:fs'

export function writeStream(
  data: any,
  stream: NodeJS.WriteStream | WriteStream,
) {
  const write = (stream as any).__write || stream.write
  return write.call(stream, data)
}
