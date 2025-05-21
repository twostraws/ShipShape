//
// ASCLogView.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import SwiftUI

struct ASCLogView: View {
    @Environment(ASCClient.self) var client

    var body: some View {
        List {
            Section("Click to print to Xcode log") {
                ForEach(client.logEntries) { entry in
                    Button(entry.url) {
                        print(entry.response)
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }
}

#Preview {
    ASCLogView()
}
