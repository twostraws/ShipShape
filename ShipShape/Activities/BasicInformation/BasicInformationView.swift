//
// BasicInformationView.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import SwiftUI

/// Displays the name, bundle ID, and SKU for an app.
struct BasicInformationView: View {
    var app: ASCApp

    var body: some View {
        Form {
            LabeledContent("ID", value: app.id)
            LabeledContent("Name", value: app.attributes.name)
            LabeledContent("Bundle ID", value: app.attributes.bundleId)
            LabeledContent("SKU", value: app.attributes.sku)
        }
        .formStyle(.grouped)
    }
}

#Preview {
    BasicInformationView(app: ASCApp.example)
}
