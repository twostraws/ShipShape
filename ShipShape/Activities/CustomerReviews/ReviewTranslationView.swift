//
// ReviewTranslationView.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import SwiftUI

struct ReviewTranslationView: View {
    var review: ASCCustomerReview

    @State private var isShowingTranslation = false

    var body: some View {
        Section {
            Text(review.attributes.body ?? DefaultValues.unknown)
                .textSelection(.enabled)
        } header: {
            HStack {
                Text(review.attributes.title ?? DefaultValues.notSet)
                Spacer()
                RatingView(rating: .constant(review.attributes.rating))
            }
        } footer: {
            HStack {
                Button("Translate", systemImage: "translate") {
                    isShowingTranslation = true
                }
                .buttonStyle(.plain)
                .labelStyle(.iconOnly)
                .translationPresentation(isPresented: $isShowingTranslation, text: review.attributes.body ?? "")

                Spacer()

                Text(
                """
                **\(review.attributes.reviewerNickname ?? DefaultValues.unknown)**, \
                \(review.attributes.createdDate.formatted())
                """
                )
            }
        }
    }
}
