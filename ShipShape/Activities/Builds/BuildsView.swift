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

    private var sortedBuilds: [ASCAppBuild] {
        app.builds.sorted { $0.attributes.version > $1.attributes.version }
    }

    var body: some View {
        LoadingView(loadState: $loadState, retryAction: load) {
            Form {
                if app.builds.isEmpty {
                    Text("No builds.")
                } else {
                    ForEach(sortedBuilds) { build in
                        Section("Version: \(build.attributes.version)") {
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

                            LabeledContent("Processing State", value: build.attributes.processingState.convertFromProcessingState)
                            LabeledContent("Upload Date", value: build.attributes.uploadedDate.formatted())
                            LabeledContent("Expiration Date", value: build.attributes.expirationDate.formatted())
                            LabeledContent("Minimum OS Version", value: build.attributes.minOsVersion)
                            LabeledContent("Internal Build ID", value: build.id)
                        }
                    }
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
                try await client.getBuilds(of: app)
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
