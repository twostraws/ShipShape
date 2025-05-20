//
// CustomerReviewsView.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import SwiftUI

/// Displays all reviews for a single app.
struct CustomerReviewsView: View {
    @Environment(ASCClient.self) var client
    @State private var loadState = LoadState.loading

    var app: ASCApp

    var body: some View {
        LoadingView(loadState: $loadState, retryAction: load) {
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
        .task(load)
    }

    func load() async {
        Task {
            do {
                loadState = .loading
                try await client.fetchReviews(of: app)
                loadState = .loaded
            } catch {
                print(error.localizedDescription)
                loadState = .failed
            }
        }
    }
}

#Preview {
    CustomerReviewsView(app: ASCApp.example)
}
