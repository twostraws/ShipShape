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

    struct Attributes: Decodable, Hashable {
        var description: String?
        var locale: String?
        var keywords: String?
    }
}
