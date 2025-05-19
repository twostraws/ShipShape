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
    var app: ASCApp

    var body: some View {
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
        .task(load)
    }

    func load() async {
        Task {
            try await client.fetchVersions(of: app)
        }
    }
}

#Preview {
    AppReviewView(app: ASCApp.example)
}
