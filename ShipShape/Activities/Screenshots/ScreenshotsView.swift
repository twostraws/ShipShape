//
// ScreenshotsView.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import SwiftUI

struct ScreenshotsView: View {
    var app: ASCApp

    var body: some View {
        Form {
            if let localization = app.localizations.first {
                ForEach(localization.screenshotSets) { screenshotSet in
                    Section(screenshotSet.attributes.screenshotDisplayType) {
                        ScrollView(.horizontal) {
                            HStack {
                                ForEach(screenshotSet.screenshots) { screenshot in
                                    AsyncImage(url: screenshot.url) { phase in
                                        switch phase {
                                        case .success(let image):
                                            image
                                                .resizable()
                                                .scaledToFit()
                                                .frame(maxWidth: 300, maxHeight: 500)

                                        case .failure:
                                            Image(systemName: "questionmark.diamond")
                                        default:
                                            ProgressView()
                                                .controlSize(.large)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } else {

            }
        }
        .formStyle(.grouped)
    }
}
