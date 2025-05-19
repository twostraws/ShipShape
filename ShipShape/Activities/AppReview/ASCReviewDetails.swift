//
// ASCReviewDetails.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

/// Stores any app review contact details for an app.
struct ASCReviewDetails: Decodable, Hashable, Identifiable {
    var id: String
    var attributes: Attributes

    struct Attributes: Decodable, Hashable {
        var contactFirstName: String?
        var contactLastName: String?
        var contactPhone: String?
        var contactEmail: String?
        var notes: String?
    }

    // MARK: Example
    static var example: ASCReviewDetails {
        return ASCReviewDetails(
            id: "123",
            attributes: Attributes(
                contactFirstName: "First Name",
                contactLastName: "Last Name",
                contactPhone: "(123) 456-7890",
                contactEmail: "example@example.com",
                notes: """
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Sit amet consectetur adipiscing elit quisque \
        faucibus ex. Adipiscing elit quisque faucibus ex sapien vitae pellentesque.
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Sit amet consectetur adipiscing elit quisque \
        faucibus ex. Adipiscing elit quisque faucibus ex sapien vitae pellentesque. Lorem ipsum dolor sit amet \
        consectetur adipiscing elit. Sit amet consectetur adipiscing elit quisque faucibus ex. Adipiscing elit \
        quisque faucibus ex sapien vitae pellentesque.
        """)
        )
    }
}
