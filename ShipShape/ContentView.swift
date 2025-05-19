//
// ContentView.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import SwiftUI

/// The launch view for the app, showing either the main view or the
/// first-run helper as appropriate.
struct ContentView: View {
    @Environment(UserSettings.self) var userSettings

    var body: some View {
        if let apiKey = userSettings.apiKey,
           let apiKeyID = userSettings.apiKeyID,
           let apiKeyIssuer = userSettings.apiKeyIssuer {
            ASCView(
                apiKey: apiKey,
                apiKeyID: apiKeyID,
                apiKeyIssuer: apiKeyIssuer
            )
        } else {
            WelcomeView()
        }
    }
}

#Preview {
    ContentView()
}
