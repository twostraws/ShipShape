//
// ASCAppScreenshot.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

struct ASCAppScreenshot: Decodable, Hashable, Identifiable {
    var id: String
    var attributes: Attributes

    var url: URL? {
        attributes.imageAsset.resolvedURL
    }

    struct Attributes: Decodable, Hashable {
        var fileName: String
        var imageAsset: ASCImageAsset
    }
}

struct ASCAppScreenshotResponse: Decodable {
    var data: [ASCAppScreenshot]
}
