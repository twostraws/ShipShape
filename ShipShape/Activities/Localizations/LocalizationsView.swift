//
// LocalizationsView.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import SwiftUI

/// Displays data about a single `ASCVersionLocalization`.
struct LocalizationsView: View {
    var app: ASCApp

    var body: some View {
        Form {
            if let localization = app.localizations.first {
                LabeledContent("Description", value: localization.attributes.description)
                LabeledContent("Keywords", value: localization.attributes.keywords)
                LabeledContent("Locale", value: localization.attributes.locale)
            } else {
                Text("No localizations.")
            }
        }
        .formStyle(.grouped)
    }
}
