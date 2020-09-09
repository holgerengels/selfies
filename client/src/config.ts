import createMatcher from '@captaincodeman/router'
import { routingPlugin } from '@captaincodeman/rdx'
import * as models from './models'

const routes = {
  '/app/selfie':                                 'selfie',
  '/app/report':                                 'report',
  '/*':                                          'start',
};

const matcher = createMatcher(routes)
const routing = routingPlugin(matcher)

export const config = { models, plugins: { routing } }
