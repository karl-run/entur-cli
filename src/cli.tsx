import React from 'react'
import meow from 'meow'
import { render } from 'ink'

import Ui from './ui'

const cli = meow(
  `
  Usage
    $ entur <stop>
  Example
    $ entur Lysaker
  Options
    --refresh-stops -r Refresh cached stops
`,
  {
    flags: {
      'refresh-stops': {
        type: 'boolean',
        alias: 'r',
      },
    },
    autoHelp: true,
  },
)

if (cli.input.length > 0) {
  console.debug('Input', cli.input)
  ;(async () => {
    render(
      <Ui stop={cli.input.join(' ')} refreshStops={cli.flags.refreshStops} />,
    )
  })()
} else {
  cli.showHelp()
}
