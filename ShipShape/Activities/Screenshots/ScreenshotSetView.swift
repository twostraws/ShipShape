//
// ScreenshotSetView.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import SwiftUI

struct ScreenshotSetView: View {
    var screenshotSet: ASCAppScreenshotSet

    var body: some View {
        Section(screenshotSet.attributes.screenshotDisplayType.convertFromDeviceName) {
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
}
