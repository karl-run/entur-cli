import React from 'react'
import { Color, Box } from 'ink'
import Fuse from 'fuse.js'
import InkTextInput from 'ink-text-input'
import Spinner from 'ink-spinner'

import { getStops } from './entur'

import { hasCachedStops, storeCachedStops } from './cache'
import { Stop } from './types'

const findSpecificStop = (stops: Stop[], id: string | undefined): Stop | null =>
  stops.find(s => s.id === id) || null

const filterStops = (stops: Stop[], input: string | undefined): Stop[] => {
  const fuse = new Fuse(stops, {
    location: 0,
    keys: ['id', 'name'],
  })

  return fuse.search(input)
}

const useStops = (
  refreshStops: boolean,
): [Stop[] | null, boolean, string | null] => {
  const [error, setError] = React.useState<string | null>(null)
  const [stops, setStops] = React.useState<Stop[] | null>(null)
  const [gettingStops, setGettingStops] = React.useState(true)

  React.useEffect(() => {
    const cachedStops = hasCachedStops()

    if (!cachedStops || refreshStops) {
      getStops()
        .then(s => {
          storeCachedStops(s)

          setStops(s)
          setGettingStops(false)
        })
        .catch(e => {
          console.log(e)
          setError(e.message)
        })
    } else {
      setGettingStops(false)
      setStops(cachedStops)
    }
  }, [])

  return [stops, gettingStops, error]
}

type Props = {
  search?: string
  specific?: string
  refreshStops: boolean
}

const Ui = ({ search, specific, refreshStops }: Props) => {
  const [input, setInput] = React.useState(search)
  const [stops, loading, error] = useStops(refreshStops)

  if (error) {
    return (
      <Box>
        <Color redBright>{error}</Color>
      </Box>
    )
  }

  if (loading) {
    return (
      <Box>
        <Box marginRight={2} marginLeft={2}>
          <Spinner />
        </Box>
        <Color yellow>Getting stops...</Color>
      </Box>
    )
  }

  if (!loading && !stops) {
    return <div>help</div>
  }

  if (specific) {
    const stop = findSpecificStop(stops, specific)

    if (!stop) {
      return (
        <Box>
          <Color redBright>No stop with id {specific} found}</Color>
        </Box>
      )
    }

    return (
      <div>
        {stop.name}, {stop.id}
      </div>
    )
  }

  const filteredStops: Stop[] = stops ? filterStops(stops, input) : []

  if (filteredStops.length > 1) {
    return (
      <Box flexDirection="column" marginLeft={4}>
        <Box margin={1}>
          <Color red bgYellow>
            More than one stop found ({filteredStops.length})
          </Color>
        </Box>
        <Box flexDirection="column">
          {filteredStops.slice(0, 10).map(fs => (
            <Box justifyContent="space-between" key={fs.id} width={30}>
              <Color dim>{fs.id} -</Color>
              <Color> {fs.name}</Color>
            </Box>
          ))}
        </Box>
        <Color>Try to limit your seach</Color>
        <InkTextInput
          value={input}
          onChange={(value: string) => setInput(value)}
        />
      </Box>
    )
  }

  return (
    <Box height="10" width="20">
      {filteredStops.length} {input}
    </Box>
  )
}

export default Ui
