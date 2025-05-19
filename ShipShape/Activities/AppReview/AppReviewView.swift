//
// AppReviewView.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import SwiftUI

/// Displays data about a single `ASCReviewDetails`.
struct AppReviewView: View {
    var app: ASCApp

    var body: some View {
        Form {
            if let reviewDetails = app.reviewDetails.first {
                LabeledContent("First Name", value: reviewDetails.attributes.contactFirstName ?? "N/A")
                LabeledContent("Last Name", value: reviewDetails.attributes.contactLastName ?? "N/A")
                LabeledContent("Notes", value: reviewDetails.attributes.notes ?? "N/A")
            } else {
                Text("No app review details.")
            }
        }
        .formStyle(.grouped)
    }
}
