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
    @State private var apps = [ASCApp]()
    @State private var selectedApp: ASCApp?
    @State private var selectedSection: AppSection?

    var body: some View {
        NavigationSplitView {
            List(apps, selection: $selectedApp) { app in
                NavigationLink(app.attributes.name, value: app)
            }
            .frame(minWidth: 200)
        } content: {
            if selectedApp != nil {
                List(selection: $selectedSection) {
                    NavigationLink("App Review", value: AppSection.appReview)
                    NavigationLink("Basic Information", value: AppSection.basicInformation)
                    NavigationLink("Localizations", value: AppSection.localizations)
                    NavigationLink("Reviews", value: AppSection.customerReviews)
                    NavigationLink("Versions", value: AppSection.versions)
                }
            } else {
                Text("Select an app")
            }
        } detail: {
            if let selectedApp, let selectedSection {
                switch selectedSection {
                case .appReview: AppReviewView(app: selectedApp)
                case .basicInformation: BasicInformationView(app: selectedApp)
                case .customerReviews: CustomerReviewsView(app: selectedApp)
                case .localizations: LocalizationsView(app: selectedApp)
                case .versions: VersionsView(app: selectedApp)
                }
            } else {
                Text("Welcome to ShipShape!")
            }
        }
        .navigationTitle("ShipShape")
        .task(load)
    }

    init(apiKey: String, apiKeyID: String, apiKeyIssuer: String) {
        let newClient = ASCClient(
            key: apiKey,
            keyID: apiKeyID,
            issuerID: apiKeyIssuer,
        )

        _client = State(initialValue: newClient)
    }

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

    /// Performs initial load of all our data.
    func loadAppData() async throws {
        var fetchedApps = try await client.fetchApps()

        for (index, app) in fetchedApps.enumerated() {
            async let reviews = client.fetchReviews(for: app)
            async let versions = client.fetchVersions(of: app)

            fetchedApps[index].customerReviews = try await reviews

            let versionData = try await versions
            fetchedApps[index].versions = versionData.data
            fetchedApps[index].localizations = versionData.appStoreVersionLocalizations
            fetchedApps[index].reviewDetails = versionData.appStoreReviewDetails
        }

        apps = fetchedApps
    }
}
