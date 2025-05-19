//
// ASCView.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import SwiftUI

/// The main view for this app, showing all apps and data
struct ASCView: View {
    @Environment(UserSettings.self) var userSettings

    @State private var client: ASCClient
    @State private var selectedApp: ASCApp?
    @State private var selectedSection: AppSection?

    var body: some View {
        NavigationSplitView {
            List(client.apps, selection: $selectedApp) { app in
                NavigationLink(app.attributes.name, value: app)
            }
            .frame(minWidth: 200)
        } content: {
            if selectedApp != nil {
                List(selection: $selectedSection) {
                    NavigationLink("App Review", value: AppSection.appReview)
                    NavigationLink("Basic Information", value: AppSection.basicInformation)
                    NavigationLink("Builds", value: AppSection.builds)
                    NavigationLink("Localizations", value: AppSection.localizations)
                    NavigationLink("Reviews", value: AppSection.customerReviews)
                    NavigationLink("Screenshots", value: AppSection.screenshots)
                    NavigationLink("Versions", value: AppSection.versions)
                }
            } else {
                Text("Select an app")
            }
        } detail: {
            if let selectedApp, let selectedSection {
                VStack {
                    switch selectedSection {
                    case .appReview: AppReviewView(app: selectedApp)
                    case .basicInformation: BasicInformationView(app: selectedApp)
                    case .builds: BuildsView(app: selectedApp)
                    case .customerReviews: CustomerReviewsView(app: selectedApp)
                    case .localizations: LocalizationsView(app: selectedApp)
                    case .screenshots: ScreenshotsView(app: selectedApp)
                    case .versions: VersionsView(app: selectedApp)
                    }
                }
                .id(selectedApp)
            } else {
                Text("Welcome to ShipShape!")
            }

        }
        .navigationTitle("ShipShape")
        .task(load)
        .environment(client)
    }

    init(apiKey: String, apiKeyID: String, apiKeyIssuer: String) {
        let newClient = ASCClient(
            key: apiKey,
            keyID: apiKeyID,
            issuerID: apiKeyIssuer,
        )

        _client = State(initialValue: newClient)
    }

#if DEBUG
    // For the preview ONLY
    init(
        apps: [ASCApp],
        selectedApp: ASCApp?,
        selectedSection: AppSection?,
        apiKey: String,
        apiKeyID: String,
        apiKeyIssuer: String
    ) {
        self.apps = apps
        self.selectedApp = selectedApp
        self.selectedSection = selectedSection

        let newClient = ASCClient(
            key: apiKey,
            keyID: apiKeyID,
            issuerID: apiKeyIssuer,
        )

        _client = State(initialValue: newClient)
    }
#endif

    /// Triggers loading our data, with some degree of error handling.
    func load() async {
        do {
            try await loadAppData()
        } catch DecodingError.keyNotFound(let key, let context) {
            print("Failed to decode due to missing key '\(key)' - \(context.debugDescription)")
        } catch DecodingError.typeMismatch(_, let context) {
            print("Failed to decode due to type mismatch - \(context.debugDescription)")
        } catch DecodingError.valueNotFound(let type, let context) {
            print("Failed to decode due to missing \(type) value - \(context.debugDescription)")
        } catch DecodingError.dataCorrupted(_) {
            print("Failed to decode: it appears to be invalid JSON.")
        } catch {
            print("Failed to decode: \(error.localizedDescription)")
        }
    }

    /// Performs initial load of our app data.
    func loadAppData() async throws {
        try await client.fetchApps()
    }
}

#Preview {
    let selectedApp = ASCApp.example
    ASCView(
        apps: [selectedApp],
        selectedApp: selectedApp,
        selectedSection: .basicInformation,
        apiKey: "123",
        apiKeyID: "123",
        apiKeyIssuer: "123"
    )
    .environment(UserSettings())
}
