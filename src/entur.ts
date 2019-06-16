import fetch from "node-fetch"

import { Stop } from "./types"

type StopsQuery = {
  stopPlaces: Stop[]
}

const stopsQuery = `
{ 
  stopPlaces {
    id
    name
  }
}
`

export const getStops = async (): Promise<Stop[]> => {
  const result = await fetchQuery<StopsQuery>(stopsQuery)

  return result.data.stopPlaces
}

type QueryResult<T> = {
  data: T
}

const fetchQuery = async <T>(
  query: string,
  variables: Record<string, string> = {},
): Promise<QueryResult<T>> => {
  const response = await fetch(
    "https://api.entur.io/journey-planner/v2/graphql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    },
  )

  return await response.json()
}
