//
// VersionsView.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import SwiftUI

/// Displays data about a single `ASCAppVersion`.
struct VersionsView: View {
    var app: ASCApp

    var body: some View {
        Form {
            if let version = app.versions.first {
                LabeledContent("Platform", value: version.attributes.platform)
                LabeledContent("Version", value: version.attributes.versionString)
                LabeledContent("State", value: version.attributes.appStoreState)
                LabeledContent("Copyright", value: version.attributes.copyright)
            } else {
                Text("No versions.")
            }
        }
        .formStyle(.grouped)
    }
}
