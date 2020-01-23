const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const findUp = require('find-up')

let syncPackageName = process.argv[2]

if (!syncPackageName) {
  try {
    const closestPackage = findUp.sync('package.json')
    if (!closestPackage) {
      console.log(chalk.red('no lerna package was found'))
      process.exit(1)
    }

    const closestPackageJson = require(closestPackage)
    if (closestPackageJson.name) {
      syncPackageName = closestPackageJson.name
    } else {
      console.log('Missing package name as argument')
      process.exit(1)
    }
  } catch (err) {
    console.log(chalk.red('could not read lerna package'))
    console.error(err)
    process.exit(1)
  }
}

const lernaPath = findUp.sync('lerna.json')

if (!lernaPath) {
  console.log(chalk.red('lerna project not found'))
  process.exit(1)
}

const rootPath = path.dirname(lernaPath)

let syncPackageJson = null
const packagesDir = path.resolve(rootPath, 'packages')

try {
  const pkgDirname = syncPackageName.replace(/@[0-9a-zA-Z]+\//, '')
  syncPackageJson = require(path.resolve(packagesDir, pkgDirname, 'package.json'))
} catch (err) {
  console.log(chalk.red(`package "${syncPackageName}" was not found`))
  console.error(err)
  process.exit(1)
}

const newVersion = syncPackageJson.version

if (!newVersion) {
  console.log(chalk.red(`package "${syncPackageName}" is missing "version"`))
  process.exit(1)
}

console.log(`${syncPackageName}: ${newVersion}\n`)

const getDirectories = source => {
  return fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
}

const packages = getDirectories(packagesDir)
packages.forEach(pkg => {
  const filepath = path.resolve(packagesDir, pkg, 'package.json')
  const stat = fs.statSync(filepath)
  if (!stat.isFile) {
    return
  }

  const packageJson = require(filepath)
  if (!packageJson.dependencies[syncPackageName]) {
    return
  }

  const oldVersion = packageJson.dependencies[syncPackageName]
  if (oldVersion === newVersion) {
    console.log(chalk.yellow(`not modified pkg ${pkg}:`.padEnd(30, '.'), `${oldVersion}`))
    return
  }

  packageJson.dependencies[syncPackageName] = newVersion
  fs.writeFileSync(filepath, `${JSON.stringify(packageJson, null, 2)}\n`)
  console.log(chalk.green(`UPDATED pkg ${pkg}:`.padEnd(30, '.'), `${oldVersion} => ${newVersion}`))
})
