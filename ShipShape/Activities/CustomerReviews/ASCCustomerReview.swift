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
    var relationships: Relationships
    var response: ASCCustomReviewResponse?

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

    struct Relationships: Decodable, Hashable {
        var response: ASCIdentifiedTypeData
    }

    // MARK: Example
    static var example: ASCCustomerReview {
        ASCCustomerReview(
            id: "1111",
            attributes: Attributes(
                rating: 5,
                title: "Awesome App!",
                body: "I love this app!",
                reviewerNickname: "John Doe",
                createdDate: Date.now,
                territory: "Somewhere"
            ),
            relationships: Relationships(response: ASCIdentifiedTypeData())
        )
    }

    static var example2: ASCCustomerReview {
        ASCCustomerReview(
            id: "2222",
            attributes: Attributes(
                rating: 5,
                title: "Epic!",
                body: "I love this app!",
                reviewerNickname: "Jane Doe",
                createdDate: Date.now,
                territory: "Elsewhere"
            ),
            relationships: Relationships(response: ASCIdentifiedTypeData())
        )
    }
}

struct ASCCustomerReviewResponse: Decodable {
    var data: [ASCCustomerReview]
    var responses = [ASCCustomReviewResponse]()

    enum CodingKeys: CodingKey {
        case data, included
    }

    init(from decoder: any Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.data = try container.decode([ASCCustomerReview].self, forKey: .data)

        if let includedData = try container.decodeIfPresent([ASCIncludedData].self, forKey: .included) {
            for item in includedData {
                switch item {
                case .customerReviewResponses(let value):
                    responses.append(value)

                default:
                    // Ignore all other types of included data.
                    break
                }
            }
        }
    }
}
