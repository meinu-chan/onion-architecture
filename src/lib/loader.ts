import { basename, join } from 'node:path'
import { opendir } from 'node:fs/promises'

export interface LoadedData<TData> {
  data: TData
  path: string
}

export async function importDirectory<TLoaded>(
  dirPath: string,
  basePath: string = ''
): Promise<LoadedData<TLoaded>[]> {
  const dir = await opendir(dirPath)
  const imports: LoadedData<TLoaded>[] = []

  for await (const dirent of dir) {
    if (dirent.name === 'index.js') continue
    if (dirent.isFile() && !dirent.name.endsWith('.js')) continue

    const baseName = basename(dirent.name, '.js')
    const absolutePath = join(basePath, baseName)

    const importPromise = dirent.isFile()
      ? importFile<TLoaded>(dirPath, dirent.name, absolutePath)
      : importDirectory<TLoaded>(join(dirPath, dirent.name), absolutePath)

    imports.push(...(await importPromise))
  }

  return imports
}

async function importFile<TLoaded>(
  path: string,
  fileName: string,
  absolutePath: string
): Promise<LoadedData<TLoaded>[]> {
  const filePath = join(path, fileName)
  const loadedFile = await import(filePath)

  if (!loadedFile.default) {
    throw new Error(`Cannot import file by path '${filePath}'`)
  }

  return [{ data: loadedFile.default, path: absolutePath }]
}
