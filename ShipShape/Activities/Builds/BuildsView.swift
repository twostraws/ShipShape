//
// BuildsView.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import SwiftUI

/// Displays data about a single `ASCAppBuild`.
struct BuildsView: View {
    @Environment(ASCClient.self) var client
    @State private var loadState = LoadState.loading
    @Logger private var logger

    var app: ASCApp

    var body: some View {
        LoadingView(loadState: $loadState, retryAction: load) {
            Form {
                if let build = app.builds.first {
                    AsyncImage(url: build.attributes.iconAssetToken.resolvedURL) { phase in
                        switch phase {
                        case .success(let image):
                            image
                                .resizable()
                                .frame(maxWidth: 100, maxHeight: 100)

                        case .failure:
                            Image(systemName: "questionmark.diamond")

                        default:
                            ProgressView()
                                .controlSize(.large)
                        }
                    }

                    LabeledContent("Version", value: build.attributes.version)
                    LabeledContent("Upload Date", value: build.attributes.uploadedDate.formatted())
                    LabeledContent("Expiration Date", value: build.attributes.expirationDate.formatted())
                    LabeledContent("Minimum OS Version", value: build.attributes.minOsVersion)
                } else {
                    Text("No builds.")
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
                try await client.fetchBuilds(of: app)
                loadState = .loaded
            } catch {
                logger.error("\(error.localizedDescription)")
                loadState = .failed
            }
        }
    }
}

#Preview {
    BuildsView(app: ASCApp.example)
}
