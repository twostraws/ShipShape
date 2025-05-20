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

    var app: ASCApp

    var body: some View {
        LoadingView(loadState: $loadState, retryAction: load) {
            Form {
                if let localization = app.localizations.first {
                    ForEach(localization.screenshotSets) { screenshotSet in
                        Section(screenshotSet.attributes.screenshotDisplayType.convertFromDeviceName) {
                            ScrollView(.horizontal) {
                                HStack {
                                    ForEach(screenshotSet.screenshots) { screenshot in
                                        AsyncImage(url: screenshot.url) { phase in
                                            switch phase {
                                            case .success(let image):
                                                image
                                                    .resizable()
                                                    .scaledToFit()
                                                    .frame(maxWidth: 300, maxHeight: 500)
                                            case .failure:
                                                Image(systemName: "questionmark.diamond")
                                            default:
                                                ProgressView()
                                                    .controlSize(.large)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    Text("No screenshots.")
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

                if app.localizations.isEmpty {
                    try await client.fetchVersions(of: app)
                }

                guard let localization = app.localizations.first else { return }

                try await client.fetchScreenshotSets(of: localization, for: app)

                loadState = .loaded
            } catch {
                print(error.localizedDescription)
                loadState = .failed
            }
        }
    }
}
