//
// AppReviewView.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import SwiftUI

/// Displays data about a single `ASCReviewDetails`.
struct AppReviewView: View {
    @Environment(ASCClient.self) var client
    @State private var loadState = LoadState.loading
    @Logger private var logger

    var app: ASCApp

    var body: some View {
        LoadingView(loadState: $loadState, retryAction: load) {
            Form {
                if let reviewDetails = app.reviewDetails.first {
                    LabeledContent("First Name", value: reviewDetails.attributes.contactFirstName ?? DefaultValues.unknown)
                    LabeledContent("Last Name", value: reviewDetails.attributes.contactLastName ?? DefaultValues.unknown)
                    LabeledContent("Notes", value: reviewDetails.attributes.notes ?? DefaultValues.notSet)
                } else {
                    Text("No app review details.")
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
                try await client.getVersions(of: app)
                loadState = .loaded
            } catch {
                logger.error("\(error.localizedDescription)")
                loadState = .failed
            }
        }
    }
}

#Preview {
    AppReviewView(app: ASCApp.example)
        .environment(ASCClient.example)
}
