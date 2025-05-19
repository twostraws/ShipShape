//
// ASCApp.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

/// One app from App Store Connect.
struct ASCApp: Decodable, Hashable, Identifiable {
    /// The app's unique identifier.
    var id: String

    var attributes: Attributes

    var customerReviews = [ASCCustomerReview]()
    var versions = [ASCAppVersion]()
    var localizations = [ASCVersionLocalization]()
    var reviewDetails = [ASCReviewDetails]()
    var builds = [ASCAppBuild]()

    enum CodingKeys: CodingKey {
        case id, attributes
    }

    struct Attributes: Decodable, Hashable {
        var name: String
        var bundleId: String
        var sku: String
    }
}

struct ASCAppResponse: Decodable {
    var data: [ASCApp]
}
