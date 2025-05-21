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
            ForEach(client.logEntries) { entry in
                Section("Click to print to Xcode log") {
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
