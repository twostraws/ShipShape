//
// CustomerReviewsView.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import SwiftUI
import Translation

/// Displays all reviews for a single app.
struct CustomerReviewsView: View {
    @Environment(ASCClient.self) var client
    @State private var loadState = LoadState.loading
    @Logger private var logger

    var app: ASCApp

    var body: some View {
        LoadingView(loadState: $loadState, retryAction: load) {
            Form {
                if app.customerReviews.isEmpty {
                    Text("No reviews")
                } else {
                    ForEach(app.customerReviews, content: ReviewTranslationView.init)
                }
            }
            .formStyle(.grouped)
        }
        .task(load)
        .toolbar {
            ReloadButton(action: load)
        }
    }

    func load() async {
        Task {
            do {
                loadState = .loading
                try await client.fetchReviews(of: app)
                loadState = .loaded
            } catch {
                logger.error("\(error.localizedDescription)")
                loadState = .failed
            }
        }
    }
}

#Preview {
    CustomerReviewsView(app: ASCApp.example)
}
