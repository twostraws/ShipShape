//
// ASCAppVersion.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

/// One ASC app can have multiple versions, e.g. v1 for iOS, v2 for macOS.
struct ASCAppVersion: Decodable, Hashable, Identifiable {
    var id: String
    var attributes: Attributes

    struct Attributes: Decodable, Hashable {
        var platform: String
        var versionString: String
        var appStoreState: String
        var copyright: String
        var createdDate: Date
    }
}

struct ASCAppVersionResponse: Decodable {
    var data: [ASCAppVersion]

    var appStoreVersionLocalizations = [ASCVersionLocalization]()
    var appStoreReviewDetails = [ASCReviewDetails]()

    enum CodingKeys: CodingKey {
        case data, included
    }

    init(from decoder: any Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.data = try container.decode([ASCAppVersion].self, forKey: .data)

        if let includedData = try container.decodeIfPresent([ASCIncludedData].self, forKey: .included) {
            for item in includedData {
                switch item {
                case .versionLocalization(let value):
                    appStoreVersionLocalizations.append(value)

                case .reviewDetails(let value):
                    appStoreReviewDetails.append(value)
                }
            }
        }
    }
}
