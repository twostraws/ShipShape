//
// ASCClient-PostEndpoints.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import Foundation

extension ASCClient {
    func postResponse(_ response: String, replyingTo review: ASCCustomerReview) async throws -> Bool {
        let response = ASCPostResponse(
            data: ASCPostAttributes(
                attributes: ASCCustomReviewResponseAttributes(responseBody: response),
                relationships: ASCCustomReviewResponseRelationships(
                    review: ASCPostDataResponse(
                        data: ASCIdentifiedType(
                            id: review.id,
                            type: "customerReviews"
                        )
                    )
                ),
                type: "customerReviewResponses"
            )
        )

        return try await post("/v1/customerReviewResponses", attaching: response)
    }
}
