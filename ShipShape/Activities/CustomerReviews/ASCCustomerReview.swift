//
// ASCCustomerReview.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

/// A review from an end user.
struct ASCCustomerReview: Comparable, Decodable, Hashable, Identifiable {
    var id: String
    var attributes: Attributes

    static func < (lhs: ASCCustomerReview, rhs: ASCCustomerReview) -> Bool {
        lhs.attributes.createdDate < rhs.attributes.createdDate
    }

    struct Attributes: Decodable, Hashable {
        var rating: Int
        var title: String?
        var body: String?
        var reviewerNickname: String?
        var createdDate: Date
        var territory: String?
    }

    // MARK: Example
    static var example: ASCCustomerReview {
        return ASCCustomerReview(
            id: "1111",
            attributes: Attributes(
                rating: 5,
                title: "Awesome App!",
                body: "I love this app!",
                reviewerNickname: "John Doe",
                createdDate: Date.now,
                territory: "Somewhere"
            )
        )
    }

    static var example2: ASCCustomerReview {
        return ASCCustomerReview(
            id: "2222",
            attributes: Attributes(
                rating: 5,
                title: "Epic!",
                body: "I love this app!",
                reviewerNickname: "Jane Doe",
                createdDate: Date.now,
                territory: "Elsewhere"
            )
        )
    }
}

struct ASCCustomerReviewResponse: Decodable {
    var data: [ASCCustomerReview]
}
