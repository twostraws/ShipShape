//
// SubscriptionsView.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import SwiftUI

/// Displays data about the subscriptions available for an app.
struct SubscriptionsView: View {
    @Environment(ASCClient.self) var client
    @State private var loadState = LoadState.loading

    var app: ASCApp

    var body: some View {
        LoadingView(loadState: $loadState, retryAction: load) {
            Form {
                if app.subscriptionGroups.isEmpty {
                    Text("No subscriptions")
                } else {
                    ForEach(app.subscriptionGroups) { subscriptionGroup in
                        Section(subscriptionGroup.attributes.referenceName) {
                            ForEach(subscriptionGroup.subscriptions) { subscription in
                                LabeledContent("Subscription ID", value: subscription.id)
                                LabeledContent("Name", value: subscription.attributes.name)
                                LabeledContent("Product ID", value: subscription.attributes.productId)
                                LabeledContent("State", value: subscription.attributes.state.convertFromApprovalState)
                                LabeledContent("Length", value: subscription.attributes.subscriptionPeriod.convertFromSubscriptionLength)
                                LabeledContent("Review note", value: subscription.attributes.reviewNote ?? DefaultValues.notSet)
                            }

                            ForEach(subscriptionGroup.subscriptionGroupLocalizations) { localization in
                                LabeledContent("\(localization.attributes.locale): \(localization.attributes.name)", value: localization.attributes.state.convertFromApprovalState)
                            }

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
                try await client.fetchSubscriptions(of: app)
                loadState = .loaded
            } catch {
                print(error.localizedDescription)
                loadState = .failed
            }
        }
    }
}

#Preview {
    LocalizationsView(app: ASCApp.example)
}
