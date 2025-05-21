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
    @Logger private var logger

    @State private var selectedPlatform = "IOS"

    var app: ASCApp

    var matchingVersions: [ASCAppVersion] {
        app.versions.filter {
            $0.attributes.platform == selectedPlatform
        }
    }

    var allPlatforms: [String] {
        Set(app.versions.map(\.attributes.platform)).sorted()
    }

    var body: some View {
        LoadingView(loadState: $loadState, retryAction: load) {
            Form {
                if matchingVersions.isEmpty {
                    Text("No versions.")
                } else {
                    if allPlatforms.count > 1 {
                        Picker("Platform", selection: $selectedPlatform) {
                            ForEach(allPlatforms, id: \.self) { platform in
                                Text(platform.convertFromPlatform).tag(platform)
                            }
                        }
                        .pickerStyle(.segmented)
                        .labelsHidden()
                    }

                    ForEach(matchingVersions) { version in
                        Section(version.attributes.versionString ?? DefaultValues.unknown) {
                            LabeledContent("Platform", value: version.attributes.platform.convertFromPlatform)
                            LabeledContent("State", value: version.attributes.appStoreState?.convertFromAppStoreState ?? DefaultValues.unknown)
                            LabeledContent("Copyright", value: version.attributes.copyright ?? DefaultValues.notSet)
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

                try await client.getVersions(of: app)
                selectedPlatform = allPlatforms.first ?? "IOS"

                loadState = .loaded
            } catch {
                logger.error("\(error.localizedDescription)")
                loadState = .failed
            }
        }
    }
}

#Preview {
    VersionsView(app: ASCApp.example)
}
