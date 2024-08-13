const fs = require("fs")
const glob = require("glob")
const semver = require("semver")
const yaml = require("yaml")

const versionBump = process.argv[2] || "patch"

function calculateNewVersion(currentVersion, bumpType) {
    switch (bumpType) {
        case "patch":
            return semver.inc(currentVersion, "patch")
        case "minor":
            return semver.inc(currentVersion, "minor")
        case "major":
            return semver.inc(currentVersion, "major")
        default:
            throw new Error(`Invalid bump type: ${bumpType}`)
    }
}

function updatePackageVersion(packagePath, newVersion) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"))
    packageJson.version = newVersion

    // Update dependencies
    const dependencyTypes = ["dependencies", "devDependencies", "peerDependencies"]
    dependencyTypes.forEach(depType => {
        if (packageJson[depType]) {
            Object.keys(packageJson[depType]).forEach(dep => {
                if (dep.startsWith("@filenest/")) {
                    packageJson[depType][dep] = "^" + newVersion
                }
            })
        }
    })

    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2))
    console.log(`Updated ${packageJson.name} to version ${newVersion}`)
}

// Filter for @filenest packages and get their paths
const packageFiles = glob.sync("packages/*/package.json");
const filenestPackages = packageFiles.filter((packagePath) => {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"))
    return packageJson.name.startsWith("@filenest/")
})

if (filenestPackages.length === 0) {
    console.error("No @filenest packages found")
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

console.log(`Highest current version found: ${highestVersion}`)
console.log(`Applying ${versionBump} version bump...`)

// Calculate the new version based on the highest current version
const newVersion = calculateNewVersion(highestVersion, versionBump)

// Update all @filenest/* packages to the new version
filenestPackages.forEach((packagePath) => {
    updatePackageVersion(packagePath, newVersion)
})

// Update examples dependencies
const exampleFiles = glob.sync("examples/*/package.json");
console.log("Updating examples dependencies...")
exampleFiles.forEach((packagePath) => {
    updatePackageVersion(packagePath, newVersion)
})

console.log(`All @filenest/* packages have been updated to version ${newVersion}`)

// Update root pnpm-lock.yaml
const lockfile = yaml.parse(fs.readFileSync("pnpm-lock.yaml", "utf8"))
console.log(lockfile)