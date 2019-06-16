import path from 'path'
import { homedir } from 'os'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'

import { Stop } from './types'

const cacheDir = `${homedir()}/.cache/entur-cli`
const stopsFile = `${cacheDir}/stops.json`

const writeFileSyncRecursive = (file: string, data: string) => {
  const folders = file.split(path.sep).slice(0, -1)

  if (folders.length) {
    console.log(folders)
    folders.reduce((last, folder) => {
      const folderPath = last ? last + path.sep + folder : folder

      console.log(folderPath, !existsSync(folderPath))

      if (!existsSync(folderPath)) {
        mkdirSync(folderPath)
      }

      return folderPath
    })
  }

  writeFileSync(file, data)
}

export const hasCachedStops = (): Stop[] | null => {
  try {
    const file: Buffer = readFileSync(stopsFile)

    return JSON.parse(file.toString())
  } catch (e) {
    return null
  }
}

export const storeCachedStops = (stops: Stop[]): boolean => {
  try {
    writeFileSyncRecursive(stopsFile, JSON.stringify(stops))
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}
