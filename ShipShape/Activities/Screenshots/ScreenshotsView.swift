//
// ScreenshotsView.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import SwiftUI

struct ScreenshotsView: View {
    @Environment(ASCClient.self) var client
    @State private var loadState = LoadState.loading
    @Logger private var logger

    var app: ASCApp

    var body: some View {
        LoadingView(loadState: $loadState, retryAction: load) {
            Form {
                if let localization = app.localizations.first {
                    ForEach(localization.screenshotSets, content: ScreenshotSetView.init)
                } else {
                    Text("No screenshots.")
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

                if app.localizations.isEmpty {
                    try await client.fetchVersions(of: app)
                }

                guard let localization = app.localizations.first else { return }
                try await client.fetchScreenshotSets(of: localization, for: app)

                loadState = .loaded
            } catch {
                logger.error("\(error.localizedDescription)")
                loadState = .failed
            }
        }
    }
}
