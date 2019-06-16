import React from 'react'
import { Color, Box } from 'ink'
import { getStops } from './entur'
import Fuse from 'fuse.js'

import { hasCachedStops, storeCachedStops } from './cache'
import { Stop } from './types'

const filterStops = (stops: Stop[], input: string) => {
  console.log(stops, input)
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
      const hallo = getStops().then(s => {
        storeCachedStops(s)

        setStops(stops)
        setGettingStops(false)
      })
    } else {
      setStops(cachedStops)
    }
  }, [])

  const filteredStops: Stop[] = stops ? filterStops(stops, stop) : []

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
