import React from 'react'
import { Color, Box } from 'ink'
import Fuse from 'fuse.js'
import InkTextInput from 'ink-text-input'

import { getStops } from './entur'

import { hasCachedStops, storeCachedStops } from './cache'
import { Stop } from './types'

const filterStops = (stops: Stop[], input: string) => {
  const fuse = new Fuse(stops, {
    location: 0,
    keys: ['name'],
  })

  return fuse.search(input)
}

type Props = {
  stop: string
  refreshStops: boolean
}

const Ui = ({ stop, refreshStops }: Props) => {
  const [stops, setStops] = React.useState<Stop[] | null>(null)
  const [gettingStops, setGettingStops] = React.useState(true)

  React.useEffect(() => {
    const cachedStops = hasCachedStops()

    if (!cachedStops || refreshStops) {
      getStops().then(s => {
        storeCachedStops(s)

        setGettingStops(false)
        setStops(stops)
      })
    } else {
      setStops(cachedStops)
    }
  }, [])

  const filteredStops: Stop[] = stops ? filterStops(stops, stop) : []

  if (filterStops) {
    return (
      <Box flexDirection="column" marginLeft={4}>
        <Color red>More one stop found ({filterStops.length})</Color>
        <Color dim>Try to limit your seach</Color>
      </Box>
    )
  }

  return (
    <Box height="10" width="20">
      {gettingStops && <Color yellow>Getting stops...</Color>}
      {filteredStops.map((s: Stop) => {
        return <Color green>{s.name} also </Color>
      })}
    </Box>
  )
}

export default Ui
