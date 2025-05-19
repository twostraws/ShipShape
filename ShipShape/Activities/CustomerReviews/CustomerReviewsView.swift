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
                    Section(review.attributes.title) {
                        Text(review.attributes.body)
                    }
                }
            }
        }
        .formStyle(.grouped)
    }
}
