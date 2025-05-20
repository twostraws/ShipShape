//
// ASCSubscriptionGroupLocalization.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

struct ASCSubscriptionGroupLocalization: Decodable, Hashable, Identifiable {
    var id: String
    var attributes: Attributes

    struct Attributes: Hashable, Decodable {
        var name: String
        var locale: String
        var state: String
    }
}
