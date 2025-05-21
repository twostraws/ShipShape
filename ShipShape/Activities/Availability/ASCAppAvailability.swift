//
// ASCAppAvailability.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

struct ASCAppAvailability: Comparable, Decodable, Hashable, Identifiable {
    var id: String
    var attributes: Attributes
    var relationships: Relationships
    var territory: String { relationships.territory.data.id }

    static func < (lhs: ASCAppAvailability, rhs: ASCAppAvailability) -> Bool {
        lhs.territory.convertFromTerritory < rhs.territory.convertFromTerritory
    }

    struct Attributes: Decodable, Hashable {
        var available: Bool
        var releaseDate: String
        var preOrderEnabled: Bool
        var preOrderPublishDate: Date?
        var contentStatuses: [String]
    }

    struct Relationships: Decodable, Hashable {
        var territory: Territory
    }

    struct Territory: Decodable, Hashable {
        var data: TerritoryData
    }

    struct TerritoryData: Decodable, Hashable {
        var id: String
    }
}

struct ASCAppAvailabilityResponse: Decodable {
    var data: [ASCAppAvailability]
}
