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
    --id -i Supply a specific stop id
    --refresh-stops -r Refresh cached stops
`,
  {
    flags: {
      'refresh-stops': {
        type: 'boolean',
        alias: 'r',
      },
      id: {
        type: 'string',
        alias: 'i',
      },
    },
    autoHelp: true,
  },
)

if (cli.input.length > 0 || cli.flags.id) {
  console.debug('Input', cli.input, cli.flags)
  ;(async () => {
    render(
      <Ui
        search={cli.input.join(' ')}
        specific={cli.flags.id}
        refreshStops={cli.flags.refreshStops}
      />,
    )
  })()
} else {
  console.debug('Input', cli.input, cli.flags)
  cli.showHelp()
}
