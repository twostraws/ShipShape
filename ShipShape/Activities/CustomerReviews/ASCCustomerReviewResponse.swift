//
// ASCCustomerReviewResponse.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

/// Used when we're given responses to reviews.
struct ASCCustomReviewResponse: Decodable, Hashable {
    var id: String
    var attributes: Attributes

    struct Attributes: Decodable, Hashable {
        var responseBody: String
        var lastModifiedDate: Date
        var state: String
    }
}

/// Used for posting review text to the API.
struct ASCCustomReviewResponseAttributes: Encodable {
    var responseBody: String
}

/// Used for posting review text to the API.
struct ASCCustomReviewResponseRelationships: Encodable {
    var review: ASCPostDataResponse
}
