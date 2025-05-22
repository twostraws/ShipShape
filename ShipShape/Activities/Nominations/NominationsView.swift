//
// NominationsView.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import SwiftUI

struct NominationsView: View {
    @Environment(ASCClient.self) var client
    @State private var loadState = LoadState.loading
    @Logger private var logger

    var app: ASCApp

    var body: some View {
        LoadingView(loadState: $loadState, retryAction: load) {
            Form {
                if app.nominations.isEmpty {
                    Text("No nominations.")
                } else {
                    ForEach(app.nominations) { nomination in
                        Section {
                            LabeledContent("Description", value: nomination.attributes.description)
                            LabeledContent("Notes", value: nomination.attributes.notes)
                        } header: {
                            HStack {
                                Text(nomination.attributes.name)
                                Spacer()
                                Text(nomination.attributes.state)
                            }
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
                try await client.getNominations(of: app)
                loadState = .loaded
            } catch {
                logger.error("\(error.localizedDescription)")
                loadState = .failed
            }
        }
    }
}
