//
// PerformanceMetricsView.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import SwiftUI

struct PerformanceMetricsView: View {
    @Environment(ASCClient.self) var client
    @State private var loadState = LoadState.loading
    @Logger private var logger

    var app: ASCApp

    var body: some View {
        LoadingView(loadState: $loadState, retryAction: load) {
            Form {
                if app.performanceMetrics.isEmpty {
                    Text("No metrics.")
                } else {
                    ForEach(app.performanceMetrics) { metrics in
                        Text("\(metrics.platform) go here…")
                    }
                }
            }
            .formStyle(.grouped)
        }
        .task(load)
        .toolbar {
            ReloadButton(action: load)
        }
    }

    func load() async {
        Task {
            do {
                loadState = .loading
                try await client.getPerformanceMetricsData(of: app)
                loadState = .loaded
            } catch {
                logger.error("\(error.localizedDescription)")
                loadState = .failed
            }
        }
    }
}
