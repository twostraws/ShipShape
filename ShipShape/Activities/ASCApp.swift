//
// ASCApp.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

/// One app from App Store Connect.
@Observable
class ASCApp: Decodable, Hashable, Identifiable {
    /// The app's unique identifier.
    var id: String

    var attributes: Attributes

    var customerReviews = [ASCCustomerReview]()
    var versions = [ASCAppVersion]()
    var localizations = [ASCVersionLocalization]()
    var reviewDetails = [ASCReviewDetails]()
    var builds = [ASCAppBuild]()

    static func == (lhs: ASCApp, rhs: ASCApp) -> Bool {
        lhs.id == rhs.id
    }

    func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }

    required init(from decoder: any Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decode(String.self, forKey: .id)
        attributes = try container.decode(Attributes.self, forKey: .attributes)
    }

    enum CodingKeys: CodingKey {
        case id, attributes
    }

    struct Attributes: Decodable, Hashable {
        var name: String
        var bundleId: String
        var sku: String
    }

    // MARK: Example
    static var example: ASCApp {
        return ASCApp(
            id: "123",
            attributes: Attributes(
                name: "Epic App Idea",
                bundleId: "amazing.app.id",
                sku: "123"
            ),
            customerReviews: [ASCCustomerReview.example, ASCCustomerReview.example2],
            versions: [ASCAppVersion.example, ASCAppVersion.example2],
            localizations: [ASCVersionLocalization.example],
            reviewDetails: [ASCReviewDetails.example],
            builds: [ASCAppBuild.example]
        )
    }
}

struct ASCAppResponse: Decodable {
    var data: [ASCApp]
}
