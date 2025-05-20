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
    @Binding var selectedApp: ASCApp?

    var body: some View {
        List(client.apps, selection: $selectedApp) { app in
            NavigationLink(app.attributes.name, value: app)
        }
        .frame(minWidth: 200)
    }
}
