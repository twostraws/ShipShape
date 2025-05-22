//
// ReviewTranslationView.swift
// ShipShape
// https://www.github.com/twostraws/ShipShape
// See LICENSE for license information.
//

import SwiftUI

struct ReviewTranslationView: View {
    var review: ASCCustomerReview

    @Environment(ASCClient.self) private var client
    @State private var isShowingTranslation = false

    @State private var isShowingReply = false
    @State private var replyText = ""

    @State private var postState = PostState.waiting

    var body: some View {
        Section {
            VStack {
                Text(review.attributes.body ?? DefaultValues.unknown)
                    .textSelection(.enabled)
                    .fixedSize(horizontal: false, vertical: true)

                if let reply = review.response {
                    VStack {
                        Text("You replied on \(reply.attributes.lastModifiedDate.formatted())")
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .bold()

                        Text(reply.attributes.responseBody)
                            .frame(maxWidth: .infinity, alignment: .leading)
                    }
                    .padding(10)
                    .background(Color.green.opacity(0.2))
                    .clipShape(.rect(cornerRadius: 5))
                    .padding(.top, 5)
                }

                if isShowingReply {
                    PostingView(loadState: postState) {
                        Text("Enter your reply:")
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .bold()
                            .padding(.top)

                        StyledTextEditor(text: $replyText)

                        HStack {
                            Button("Submit", action: submitReply)
                            Button("Cancel", action: cancelReply)
                        }
                    }
                }
            }
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
                .translationPresentation(isPresented: $isShowingTranslation, text: review.attributes.body ?? "")

                Button("Reply", systemImage: "arrowshape.turn.up.left") {
                    withAnimation {
                        isShowingReply = true
                    }
                }

                Spacer()

                Text(
                """
                **\(review.attributes.reviewerNickname ?? DefaultValues.unknown)**, \
                \(review.attributes.createdDate.formatted())
                """
                )
            }
            .buttonStyle(.plain)
            .labelStyle(.iconOnly)
            .padding(.horizontal, 10)
        }
    }

    func submitReply() {
        Task {
            postState = .submitting

            do {
                let result = try await client.postResponse(replyText, replyingTo: review)

                if result {
                    postState = .submitted
                } else {
                    postState = .waiting
                }
            } catch {
                postState = .waiting
            }
        }
    }

    func cancelReply() {
        withAnimation {
            isShowingReply = false
        }
    }
}
