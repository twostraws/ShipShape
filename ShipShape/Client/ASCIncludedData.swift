//
// ASCIncludedData.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

/// Stores extra data sent back from the ASC API.
enum ASCIncludedData: Decodable {
    case reviewDetails(ASCReviewDetails)
    case subscription(ASCSubscription)
    case subscriptionGroupLocalization(ASCSubscriptionGroupLocalization)
    case versionLocalization(ASCVersionLocalization)

    enum CodingKeys: String, CodingKey {
        case type
    }

    init(from decoder: any Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let type = try container.decode(String.self, forKey: .type)

        switch type {
        case "appStoreVersionLocalizations":
            try self = .versionLocalization(ASCVersionLocalization(from: decoder))
        case "appStoreReviewDetails":
            try self = .reviewDetails(ASCReviewDetails(from: decoder))
        case "subscriptions":
            try self = .subscription(ASCSubscription(from: decoder))
        case "subscriptionGroupLocalizations":
            try self = .subscriptionGroupLocalization(ASCSubscriptionGroupLocalization(from: decoder))
        default:
            fatalError("Unsupported included type: \(type)")
        }
    }
}
