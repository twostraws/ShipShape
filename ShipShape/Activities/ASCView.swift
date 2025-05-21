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
    @State private var loadState = LoadState.loading

    @State private var isShowingDebugInput = false
    @AppStorage("debugURL") private var debugURL = ""

    var body: some View {
        NavigationSplitView {
            LoadingView(loadState: $loadState, retryAction: load) {
                AppListingView(selectedApp: $selectedApp)
            }
        } content: {
            if selectedApp != nil {
                List(selection: $selectedSection) {
                    NavigationLink("App Review", value: AppSection.appReview)
                    NavigationLink("Availability", value: AppSection.availability)
                    NavigationLink("Basic Information", value: AppSection.basicInformation)
                    NavigationLink("Builds", value: AppSection.builds)
                    NavigationLink("In-app Purchases", value: AppSection.inAppPurchases)
                    NavigationLink("Localizations", value: AppSection.localizations)
                    NavigationLink("Nominations", value: AppSection.nominations)
                    NavigationLink("Performance Metrics", value: AppSection.performanceMetrics)
                    NavigationLink("Reviews", value: AppSection.customerReviews)
                    NavigationLink("Screenshots", value: AppSection.screenshots)
                    NavigationLink("Subscriptions", value: AppSection.subscriptions)
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
                    case .availability: AppAvailabilityView(app: selectedApp)
                    case .basicInformation: BasicInformationView(app: selectedApp)
                    case .builds: BuildsView(app: selectedApp)
                    case .customerReviews: CustomerReviewsView(app: selectedApp)
                    case .inAppPurchases: InAppPurchasesView(app: selectedApp)
                    case .localizations: LocalizationsView(app: selectedApp)
                    case .nominations: NominationsView(app: selectedApp)
                    case .performanceMetrics: PerformanceMetricsView(app: selectedApp)
                    case .screenshots: ScreenshotsView(app: selectedApp)
                    case .subscriptions: SubscriptionsView(app: selectedApp)
                    case .versions: VersionsView(app: selectedApp)
                    }
                }
                .id(selectedApp)
            } else {
                Text("Welcome to ShipShape!")
            }

        }
        .navigationTitle("ShipShape")
        #if os(macOS)
        .inspector(isPresented: .constant(true), content: ASCLogView.init)
        #endif
        .environment(client)
        .task(load)
        .toolbar {
            Button("Make Debug Request") {
                isShowingDebugInput = true
            }
        }
        .alert("What URL do you want to access?", isPresented: $isShowingDebugInput) {
            Button("OK", action: makeDebugRequest)
            Button("Cancel", role: .cancel) { }
            TextField("Enter a URL", text: $debugURL)
        } message: {
            Text("This will fetch the URL and print it to the debug console, then trigger a crash.")
        }
    }

    init(apiKey: String, apiKeyID: String, apiKeyIssuer: String) {
        let newClient = ASCClient(
            key: apiKey,
            keyID: apiKeyID,
            issuerID: apiKeyIssuer,
        )

        _client = State(initialValue: newClient)
    }

    /// Performs initial load of our app data.
    func load() async {
        do {
            loadState = .loading
            try await client.fetchApps()
            loadState = .loaded
        } catch {
            loadState = .failed
        }
    }

    func makeDebugRequest() {
        Task {
            // Strip out the base URL if it's present.
            var rootURL = debugURL
            rootURL.replace("https://api.appstoreconnect.apple.com", with: "")

            _ = try await client.fetch(rootURL, as: String.self)
        }
    }
}

#if DEBUG
extension ASCView {
    // For the preview ONLY
    init(
        apps: [ASCApp],
        selectedApp: ASCApp?,
        selectedSection: AppSection?,
        apiKey: String,
        apiKeyID: String,
        apiKeyIssuer: String
    ) {
        self.selectedApp = selectedApp
        self.selectedSection = selectedSection

        let newClient = ASCClient(
            key: apiKey,
            keyID: apiKeyID,
            issuerID: apiKeyIssuer,
        )

        newClient.apps = apps

        _client = State(initialValue: newClient)
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
#endif
