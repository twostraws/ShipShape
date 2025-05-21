//
// PostingView.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import SwiftUI

struct PostingView<Content: View>: View {
    var loadState: PostState
    @ViewBuilder var content: () -> Content

    var body: some View {
        switch loadState {
        case .waiting:
            content()
        case .submitting:
            ProgressView()
        case .submitted:
            Image(systemName: "checkmark.circle")
                .symbolVariant(.fill)
                .foregroundStyle(.green)
                .font(.title)
                .padding(.top, 5)
        }
    }
}
