
import config from '@innei/prettier'

export default {
  ...config,
  importOrderParserPlugins: ['typescript', 'decorators-legacy'],
}