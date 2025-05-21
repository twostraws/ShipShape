//
// ReloadButton.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import SwiftUI

struct ReloadButton: View {
    var action: () async -> Void

    var body: some View {
        Button("Reload", systemImage: "arrow.clockwise") {
            Task {
                await action()
            }
        }
    }
}
