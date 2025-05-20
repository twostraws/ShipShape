//
// InAppPurchasesView.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import SwiftUI

/// Displays data about all `ASCInAppPurchase` instances for an app.
struct InAppPurchasesView: View {
    @Environment(ASCClient.self) var client
    @State private var loadState = LoadState.loading

    var app: ASCApp

    var body: some View {
        LoadingView(loadState: $loadState, retryAction: load) {
            Form {
                if app.inAppPurchases.isEmpty {
                    Text("No in-app purchases.")
                } else {
                    ForEach(app.inAppPurchases) { inAppPurchase in
                        Section(inAppPurchase.attributes.name) {
                            LabeledContent("ID", value: inAppPurchase.id)
                            LabeledContent("Type", value: inAppPurchase.attributes.inAppPurchaseType.convertFromInAppPurchaseType)
                            LabeledContent("Product ID", value: inAppPurchase.attributes.productId)
                            LabeledContent("Status", value: inAppPurchase.attributes.state.convertFromApprovalState)
                            LabeledContent("Review Note", value: inAppPurchase.attributes.reviewNote ?? DefaultValues.notSet)
                        }
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
                try await client.fetchInAppPurchases(of: app)
                loadState = .loaded
            } catch {
                print(error.localizedDescription)
                loadState = .failed
            }
        }
    }
}
