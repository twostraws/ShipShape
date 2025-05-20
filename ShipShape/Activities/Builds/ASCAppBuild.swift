//
// ASCAppBuild.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

struct ASCAppBuild: Decodable, Hashable, Identifiable {
    var id: String
    var attributes: Attributes

    struct Attributes: Decodable, Hashable {
        var version: String
        var uploadedDate: Date
        var expirationDate: Date
        var expired: Bool
        var minOsVersion: String
        var iconAssetToken: ASCImageAsset
    }

    // MARK: Example
    static var example: ASCAppBuild {
        return ASCAppBuild(
            id: "123",
            attributes: Attributes(
                version: "1.0.0",
                uploadedDate: Date.now,
                expirationDate: Date.now,
                expired: false,
                minOsVersion: "14.0",
                iconAssetToken: ASCImageAsset.example
            )
        )
    }
}

struct ASCAppBuildResponse: Decodable, Hashable {
    var data: [ASCAppBuild]
}
