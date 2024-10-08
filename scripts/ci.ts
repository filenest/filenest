import fs from "fs"
import { glob } from "glob"
import semver from "semver"
import chalk from "chalk"
import { execSync } from "child_process"
import * as ci from "@actions/core"

const versionBump = process.env.VERSION_BUMP_TYPE as BumpType

type BumpType = "patch" | "minor" | "major"

function calculateNewVersion(currentVersion: string, bumpType: BumpType) {
    switch (bumpType) {
        case "patch":
            return semver.inc(currentVersion, bumpType)
        case "minor":
            return semver.inc(currentVersion, bumpType)
        case "major":
            return semver.inc(currentVersion, bumpType)
        default:
            throw new Error(`Invalid bump type: ${bumpType}`)
    }
}

function setPackageVersion(packagePath: string, newVersion: string) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"))

    if (newVersion !== "workspace:*" || !newVersion.includes("workspace")) {
        packageJson.version = newVersion
    }

    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 4))
    console.log(`Updated ${packageJson.name} to version ${newVersion}`)
}

function setFilenestDependenciesVersion(packagePath: string, newVersion: string) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"))

    // Update dependencies
    const dependencyTypes = ["dependencies", "devDependencies", "peerDependencies"]
    dependencyTypes.forEach(depType => {
        if (packageJson[depType]) {
            Object.keys(packageJson[depType]).forEach(dep => {
                if (dep.startsWith("@filenest/")) {
                    packageJson[depType][dep] = newVersion
                }
            })
        }
    })

    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 4))
    console.log(`Updated ${packageJson.name} dependencies`)
}

//================================================================/
// Build packages first
//================================================================/
console.log(chalk.cyanBright("\nLinting packages..."))
execSync("pnpm lint", { stdio: "inherit" })

console.log(chalk.cyanBright("\nBuilding packages..."))
execSync("pnpm build", { stdio: "inherit" })

//================================================================/
// Prepare for publish: Bump versions and update dependencies
//================================================================/

// Filter for @filenest packages and get their paths
const packageFiles = glob.sync("packages/*/package.json");
const filenestPackages = packageFiles.filter((packagePath) => {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"))
    return packageJson.name.startsWith("@filenest/")
})

if (filenestPackages.length === 0) {
    console.log(chalk.redBright("No @filenest packages found"))
    process.exit(1)
}

// Find the highest current version
let highestVersion = "0.0.0"
filenestPackages.forEach((packagePath) => {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"))
    if (semver.gt(packageJson.version, highestVersion)) {
        highestVersion = packageJson.version
    }
})

console.log(chalk.cyanBright(`Highest current version found: ${highestVersion}`))
console.log(chalk.cyanBright(`Applying ${versionBump} version bump...\n`))

// Calculate the new version based on the highest current version
const newVersion = calculateNewVersion(highestVersion, versionBump)

if (!newVersion) {
    console.log(chalk.redBright(`Invalid new version. Got highestVersion: ${highestVersion}, versionBump: ${versionBump}`))
    process.exit(1)
}

// Update all @filenest/* packages to the new version
filenestPackages.forEach((packagePath) => {
    setPackageVersion(packagePath, newVersion)
    setFilenestDependenciesVersion(packagePath, newVersion)
})

// Update examples dependencies
const exampleFiles = glob.sync("examples/*/package.json");
console.log("Updating examples dependencies...")
exampleFiles.forEach((packagePath) => {
    setFilenestDependenciesVersion(packagePath, newVersion)
})

console.log(chalk.greenBright("\n================================================================"))
console.log(chalk.greenBright(`All @filenest/* packages have been updated to version ${newVersion}`))
console.log(chalk.greenBright("================================================================\n"))

//================================================================/
// Publish all packages to npm
//================================================================/

execSync("pnpm -r publish --access public --no-git-checks --filter '@filenest/*'", { stdio: "inherit" })

ci.setOutput("version", newVersion)

console.log(chalk.greenBright("\n================================================================"))
console.log(chalk.greenBright(`Published all @filenest/* packages to npm (version ${newVersion})`))
console.log(chalk.greenBright("================================================================\n"))

//================================================================/
// Clean up
//================================================================/

// Reset all dependencies to use workspace:*
const filesToReset = [...exampleFiles, ...packageFiles]
filesToReset.forEach((packagePath) => {
    setFilenestDependenciesVersion(packagePath, "workspace:*")
})

console.log(chalk.cyanBright("\nWorkspace was reset"))
console.log(chalk.cyanBright("\nCommitting changes..."))

// Committing and creating GH release is done directly in workflow
