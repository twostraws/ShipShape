//
// ShipShapeApp.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import SwiftUI

@main
struct ShipShapeApp: App {
    @State private var userSettings = UserSettings()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(userSettings)
        }
        .commands {
            CommandGroup(after: .newItem) {
                Button("Clear Credentials", action: userSettings.clearCredentials)
            }
        }
    }
}
