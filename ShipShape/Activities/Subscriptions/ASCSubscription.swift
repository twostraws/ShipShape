//
// ASCSubscription.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

struct ASCSubscription: Decodable, Hashable, Identifiable {
    var id: String
    var attributes: Attributes

    struct Attributes: Decodable, Hashable {
        var name: String
        var productId: String
        var familySharable: Bool
        var state: String
        var subscriptionPeriod: String
        var reviewNote: String?
    }
}
