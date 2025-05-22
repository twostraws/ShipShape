//
// ASCAppNomination.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

struct ASCAppNomination: Decodable, Hashable, Identifiable {
    var id: String
    var attributes: Attributes

    struct Attributes: Decodable, Hashable {
        var name: String
        var type: String
        var description: String
        var createdDate: String
        var lastModifiedDate: String
        var submittedDate: String?
        var state: String
        var publishStartDate: String?
        var publishEndDate: String?
        var deviceFamilies: [String]
        var locales: [String]
        var supplementalMaterialsUris: [URL]?
        var launchInSelectMarketsFirst: Bool
        var notes: String
    }
}

struct ASCAppNominationResponse: Decodable {
    var data: [ASCAppNomination]
}
