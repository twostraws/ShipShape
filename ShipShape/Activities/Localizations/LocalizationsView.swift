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
                LabeledContent("Description", value: localization.attributes.description ?? DefaultValues.notSet)
                LabeledContent("Keywords", value: localization.attributes.keywords ?? DefaultValues.notSet)
                LabeledContent("Locale", value: localization.attributes.locale ?? DefaultValues.unknown)
            } else {
                Text("No localizations.")
            }
        }
        .formStyle(.grouped)
    }
}

#Preview {
    LocalizationsView(app: ASCApp.example)
}
