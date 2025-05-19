//
// CustomerReviewsView.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import SwiftUI

/// Displays all reviews for a single app.
struct CustomerReviewsView: View {
    var app: ASCApp

    var body: some View {
        Form {
            if app.customerReviews.isEmpty {
                Text("No reviews")
            } else {
                ForEach(app.customerReviews) { review in
                    Section {
                        Text(review.attributes.body ?? DefaultValues.unknown)
                            .textSelection(.enabled)
                    } header: {
                        HStack {
                            Text(review.attributes.title ?? DefaultValues.notSet)
                            Spacer()
                            RatingView(rating: .constant(review.attributes.rating))
                        }
                    } footer: {
                        Text(review.attributes.reviewerNickname ?? DefaultValues.unknown)
                    }
                }
            }
        }
        .formStyle(.grouped)
    }
}

#Preview {
    CustomerReviewsView(app: ASCApp.example)
}
