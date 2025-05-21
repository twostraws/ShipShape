//
// AppAvailabilityView.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import SwiftUI

struct AppAvailabilityView: View {
    @Environment(ASCClient.self) var client
    @State private var loadState = LoadState.loading
    @Logger private var logger

    var app: ASCApp

    var body: some View {
        LoadingView(loadState: $loadState, retryAction: load) {
            Form {
                if app.availability.isEmpty {
                    Text("No availability data.")
                } else {
                    ForEach(app.availability) { availability in
                        LabeledContent(
                            availability.territory.convertFromTerritory,
                            value: availability.attributes.contentStatuses.convertFromContentStatus
                        )
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
        do {
            loadState = .loading
            try await client.getAvailability(of: app)
            loadState = .loaded
        } catch {
            logger.error("\(error.localizedDescription)")
            loadState = .failed
        }
    }
}

#Preview {
    LocalizationsView(app: ASCApp.example)
}
