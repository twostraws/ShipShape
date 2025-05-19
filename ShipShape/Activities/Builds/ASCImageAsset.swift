//
// ASCImageAsset.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

/// An asset for an app, e.g. its icon or a screenshot.
struct ASCImageAsset: Decodable, Hashable {
    var templateUrl: String
    var width: Int
    var height: Int

    var resolvedURL: URL? {
        let resolvedString = templateUrl
            .replacing("{w}", with: String(width))
            .replacing("{h}", with: String(height))
            .replacing("{f}", with: "jpg")
        return URL(string: resolvedString)
    }
}
