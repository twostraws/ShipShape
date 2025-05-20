//
// AppListingView.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import SwiftUI

/// The primary sidebar for the app, showing all available apps.
struct AppListingView: View {
    @Environment(ASCClient.self) var client
    @Environment(UserSettings.self) var userSettings

    @Binding var selectedApp: ASCApp?
    @State private var filterText = ""

    @AppStorage(Constants.isShowingHiddenApps) private var isShowingHiddenApps = false

    /// Handles filtering the apps by search text, and also allowing users
    /// to hide apps they aren't interested in right now.
    var filteredApps: [ASCApp] {
        client.apps.filter { app in
            if isShowingHiddenApps == false && userSettings.isHidden(app: app) {
                false
            } else if filterText.isEmpty {
                true
            } else {
                app.attributes.name.localizedCaseInsensitiveContains(filterText)
            }
        }
    }

    var body: some View {
        List(filteredApps, selection: $selectedApp) { app in
            NavigationLink(value: app) {
                Text(app.attributes.name)
                    .opacity(userSettings.isHidden(app: app) ? 0.5 : 1)
            }
            .contextMenu {
                Button(userSettings.isHidden(app: app) ? "Unhide this app" : "Hide this app") {
                    userSettings.toggleVisibility(for: app)
                }
            }
        }
        .frame(minWidth: 200)
        .searchable(text: $filterText, placement: .sidebar)
        .toolbar {
            Menu("Filter", systemImage: "line.3.horizontal.decrease.circle") {
                Button(isShowingHiddenApps ? "Hide Hidden Apps" : "Show Hidden Apps") {
                    isShowingHiddenApps.toggle()
                }
            }
        }
        .onChange(of: filteredApps, checkForSelectionChange)
    }

    /// If the user selects an app then hides it, we need to deselect it.
    func checkForSelectionChange() {
        if let selectedApp {
            if filteredApps.contains(selectedApp) == false {
                self.selectedApp = nil
            }
        }
    }
}
