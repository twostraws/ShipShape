//
// LoadingView.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import SwiftUI

struct LoadingView<Content: View>: View {
    @Binding var loadState: LoadState
    var retryAction: () async -> Void
    @ViewBuilder var content: () -> Content

    var body: some View {
        switch loadState {
        case .loading:
            ProgressView()
        case .loaded:
            content()
        case .failed:
            ContentUnavailableView {
                Text("Load failed")
            } description: {
                Text("Please try again.")
            } actions: {
                Button("Retry") {
                    Task {
                        await retryAction()
                    }
                }
            }
        }
    }
}
