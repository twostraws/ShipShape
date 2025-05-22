//
// ASCSubscriptionGroup.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

struct ASCSubscriptionGroup: Decodable, Hashable, Identifiable {
    var id: String
    var attributes: Attributes

    var subscriptions = [ASCSubscription]()
    var subscriptionGroupLocalizations = [ASCSubscriptionGroupLocalization]()

    enum CodingKeys: CodingKey {
        case id, attributes
    }

    struct Attributes: Decodable, Hashable {
        var referenceName: String
    }
}

struct ASCSubscriptionGroupResponse: Decodable {
    var data: [ASCSubscriptionGroup]

    enum CodingKeys: CodingKey {
        case data, included
    }

    var subscriptions = [ASCSubscription]()
    var subscriptionGroupLocalizations = [ASCSubscriptionGroupLocalization]()

    init(from decoder: any Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.data = try container.decode([ASCSubscriptionGroup].self, forKey: .data)

        if let includedData = try container.decodeIfPresent([ASCIncludedData].self, forKey: .included) {
            for item in includedData {
                switch item {
                case .subscription(let value):
                    subscriptions.append(value)

                case .subscriptionGroupLocalization(let value):
                    subscriptionGroupLocalizations.append(value)

                default:
                    // Ignore all other types of included data.
                    break
                }
            }
        }
    }
}
