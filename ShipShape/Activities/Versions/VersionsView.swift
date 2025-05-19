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
                LabeledContent("Platform", value: version.attributes.platform ?? DefaultValues.unknown)
                LabeledContent("Version", value: version.attributes.versionString ?? DefaultValues.notSet)
                LabeledContent("State", value: version.attributes.appStoreState ?? DefaultValues.unknown)
                LabeledContent("Copyright", value: version.attributes.copyright ?? DefaultValues.notSet)
            } else {
                Text("No versions.")
            }
        }
        .formStyle(.grouped)
    }
}
