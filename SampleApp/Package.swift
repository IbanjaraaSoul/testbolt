// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "SampleApp",
    platforms: [
        .iOS(.v16)
    ],
    products: [
        .library(
            name: "SampleApp",
            targets: ["SampleApp"]),
    ],
    targets: [
        .target(
            name: "SampleApp",
            dependencies: []),
    ]
)

