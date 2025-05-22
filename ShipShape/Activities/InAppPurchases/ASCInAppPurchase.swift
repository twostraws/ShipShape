//
// ASCInAppPurchase.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

struct ASCInAppPurchase: Decodable, Hashable, Identifiable {
    var id: String
    var attributes: Attributes

    struct Attributes: Decodable, Hashable {
        var name: String
        var productId: String
        var inAppPurchaseType: String
        var state: String
        var reviewNote: String?
        var familySharable: Bool
        var contentHosting: Bool
    }
}

struct ASCInAppPurchaseResponse: Decodable {
    var data: [ASCInAppPurchase]
}
