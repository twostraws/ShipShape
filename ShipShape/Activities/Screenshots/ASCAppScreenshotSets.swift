//
// ASCAppScreenshotSet.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

struct ASCAppScreenshotSet: Decodable, Hashable, Identifiable {
    var id: String
    var attributes: Attributes
    var screenshots = [ASCAppScreenshot]()

    enum CodingKeys: CodingKey {
        case id, attributes
    }

    struct Attributes: Decodable, Hashable {
        var screenshotDisplayType: String
    }
}

struct ASCAppScreenshotSetResponse: Decodable {
    var data: [ASCAppScreenshotSet]
}
