//
// LocalizationsView.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import SwiftUI

/// Displays data about a single `ASCVersionLocalization`.
struct LocalizationsView: View {
    @Environment(ASCClient.self) var client
    var app: ASCApp

    var body: some View {
        Form {
            if let localization = app.localizations.first {
                Section("Description") {
                    Text(localization.attributes.description ?? DefaultValues.notSet)
                        .textSelection(.enabled)
                }

                Section("Keywords") {
                    Text(localization.attributes.keywords?.replacing(",", with: ", ") ?? DefaultValues.notSet)
                        .textSelection(.enabled)
                }

                LabeledContent("Locale", value: localization.attributes.locale ?? DefaultValues.unknown)
            } else {
                Text("No localizations.")
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
    LocalizationsView(app: ASCApp.example)
}
