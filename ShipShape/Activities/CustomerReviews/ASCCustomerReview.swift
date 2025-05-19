//
// ASCCustomerReview.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

/// A review from an end user.
struct ASCCustomerReview: Decodable, Hashable, Identifiable {
    var id: String
    var attributes: Attributes

    struct Attributes: Decodable, Hashable {
        var rating: Int
        var title: String?
        var body: String?
        var reviewerNickname: String?
        var createdDate: Date
        var territory: String?
    }
}

struct ASCCustomerReviewResponse: Decodable {
    var data: [ASCCustomerReview]
}
