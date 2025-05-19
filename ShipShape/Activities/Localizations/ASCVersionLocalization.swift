//
// ASCVersionLocalization.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

/// Metadata about a single version of an app.
struct ASCVersionLocalization: Decodable, Hashable, Identifiable {
    var id: String
    var attributes: Attributes
    var screenshotSets = [ASCAppScreenshotSet]()

    enum CodingKeys: CodingKey {
        case id, attributes
    }

    struct Attributes: Decodable, Hashable {
        var description: String?
        var locale: String?
        var keywords: String?
    }

    // MARK: Example
    static var example: ASCVersionLocalization {
        return ASCVersionLocalization(
            id: "123",
            attributes: Attributes(
                description: "abc123",
                locale: "213",
                keywords: "123"
            )
        )
    }
}
