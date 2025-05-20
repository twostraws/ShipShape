//
// VersionsView.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import SwiftUI

/// Displays data about a single `ASCAppVersion`.
struct VersionsView: View {
    @Environment(ASCClient.self) var client
    @State private var loadState = LoadState.loading

    var app: ASCApp

    var body: some View {
        LoadingView(loadState: $loadState, retryAction: load) {
            Form {
                if let version = app.versions.first {
                    LabeledContent("Platform", value: version.attributes.platform?.convertFromPlatform ?? DefaultValues.unknown)
                    LabeledContent("Version", value: version.attributes.versionString ?? DefaultValues.notSet)
                    LabeledContent("State", value: version.attributes.appStoreState?.convertFromAppStoreState ?? DefaultValues.unknown)
                    LabeledContent("Copyright", value: version.attributes.copyright ?? DefaultValues.notSet)
                } else {
                    Text("No versions.")
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
                try await client.fetchVersions(of: app)
                loadState = .loaded
            } catch {
                print(error.localizedDescription)
                loadState = .failed
            }
        }
    }
}

#Preview {
    VersionsView(app: ASCApp.example)
}
